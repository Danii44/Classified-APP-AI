import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface SearchFilters {
  search?: string
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  page?: number
  limit?: number
}

/**
 * Search for ads with comprehensive filtering
 */
export async function searchAds(filters: SearchFilters) {
  const {
    search,
    category,
    city,
    minPrice,
    maxPrice,
    condition,
    page = 1,
    limit = 20
  } = filters

  const offset = (page - 1) * limit

  let query = supabase
    .from('ads')
    .select(
      'id, title, price, currency, city, is_featured, condition, created_at, ad_images(image_url)',
      { count: 'exact' }
    )
    .eq('status', 'active')

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (category) {
    query = query.eq('category_id', category)
  }

  if (city) {
    query = query.eq('city', city)
  }

  if (minPrice) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }

  if (condition) {
    query = query.eq('condition', condition)
  }

  const { data, error, count } = await query
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return {
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit)
    }
  }
}

/**
 * Search by location (within radius)
 */
export async function searchByLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 10,
  categoryId?: string
) {
  const { data, error } = await supabase.rpc('search_ads_by_location', {
    p_latitude: latitude,
    p_longitude: longitude,
    p_radius_km: radiusKm,
    p_category_id: categoryId || null
  })

  if (error) throw error

  return data
}

/**
 * Get featured ads
 */
export async function getFeaturedAds(limit: number = 10) {
  const { data, error } = await supabase
    .from('ads')
    .select('id, title, price, currency, city, created_at, ad_images(image_url)')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data
}

/**
 * Get trending ads (most viewed)
 */
export async function getTrendingAds(limit: number = 10) {
  const { data, error } = await supabase
    .from('ads')
    .select('id, title, price, currency, city, views_count, created_at, ad_images(image_url)')
    .eq('status', 'active')
    .order('views_count', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data
}

/**
 * Get ads by specific category
 */
export async function getAdsByCategory(
  categoryId: string,
  page: number = 1,
  limit: number = 20
) {
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('ads')
    .select('id, title, price, currency, city, created_at, ad_images(image_url)', { count: 'exact' })
    .eq('status', 'active')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return {
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit)
    }
  }
}

/**
 * Get category attributes for search/filter UI
 */
export async function getCategoryAttributes(categoryId: string) {
  const { data, error } = await supabase
    .from('category_attributes')
    .select('*')
    .eq('category_id', categoryId)
    .order('display_order')

  if (error) throw error

  return data
}

/**
 * Get ad with all attributes
 */
export async function getAdWithAttributes(adId: string) {
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', adId)
    .single()

  if (adError) throw adError

  const { data: attributes, error: attrError } = await supabase
    .from('ad_attribute_values')
    .select('*, category_attributes(attribute_name, attribute_type)')
    .eq('ad_id', adId)

  if (attrError) throw attrError

  const { data: images, error: imgError } = await supabase
    .from('ad_images')
    .select('*')
    .eq('ad_id', adId)
    .order('image_order')

  if (imgError) throw imgError

  return {
    ...ad,
    attributes,
    images
  }
}

/**
 * Search with advanced EAV attribute filtering
 */
export async function searchWithAttributes(
  categoryId: string,
  attributeFilters: Record<string, any>,
  priceRange?: { min: number; max: number }
) {
  let query = supabase
    .from('ads')
    .select(
      'id, title, price, city, ad_images(image_url)',
      { count: 'exact' }
    )
    .eq('status', 'active')
    .eq('category_id', categoryId)

  if (priceRange) {
    query = query.gte('price', priceRange.min).lte('price', priceRange.max)
  }

  const { data: baseAds, error: baseError } = await query

  if (baseError) throw baseError

  // Filter by attributes
  let filteredAds = [...baseAds]

  for (const [attrName, attrValue] of Object.entries(attributeFilters)) {
    if (!attrValue) continue

    const { data: matchingAds } = await supabase
      .from('ad_attribute_values')
      .select('ad_id')
      .eq('value', String(attrValue))
      .in('ad_id', filteredAds.map(a => a.id))

    if (matchingAds) {
      const matchingIds = matchingAds.map(m => m.ad_id)
      filteredAds = filteredAds.filter(a => matchingIds.includes(a.id))
    }
  }

  return filteredAds
}
