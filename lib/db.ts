import { createClient } from '@/lib/supabase/server'

export async function initializeDatabase() {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_user_stats')
  if (error) console.error('DB init error:', error)
  return data
}

export async function getCountries() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  return data
}

export async function getCategories() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getCategoryAttributes(categoryId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('category_attributes')
    .select('*')
    .eq('category_id', categoryId)

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getListings(filters?: any) {
  const supabase = createClient()
  let query = supabase
    .from('listings')
    .select('*, listing_media(*), profiles(first_name, last_name, avatar_url)')
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.countryId) {
    query = query.eq('country_id', filters.countryId)
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters?.priceMin) {
    query = query.gte('price', filters.priceMin)
  }
  if (filters?.priceMax) {
    query = query.lte('price', filters.priceMax)
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  } else {
    query = query.limit(20)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getListingById(listingId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_media(*), profiles(first_name, last_name, avatar_url, role), reviews(*)')
    .eq('id', listingId)
    .single()

  if (error) throw error
  return data
}

export async function createListing(listingData: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .insert([listingData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateListing(listingId: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', listingId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteListing(listingId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', listingId)
    .select()

  if (error) throw error
  return data
}

export async function uploadMedia(listingId: string, file: File) {
  const supabase = createClient()
  const filename = `${listingId}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('listings')
    .upload(filename, file)

  if (error) throw error

  const { data: urlData } = supabase.storage.from('listings').getPublicUrl(filename)

  const { data: mediaData, error: mediaError } = await supabase
    .from('listing_media')
    .insert([
      {
        listing_id: listingId,
        url: urlData.publicUrl,
        media_type: file.type.startsWith('video') ? 'video' : 'image',
      },
    ])
    .select()
    .single()

  if (mediaError) throw mediaError
  return mediaData
}

export async function saveListing(listingId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('saved_listings')
    .insert([{ listing_id: listingId, user_id: userId }])
    .select()

  if (error) throw error
  return data
}

export async function unsaveListing(listingId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('listing_id', listingId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function getSavedListings(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('saved_listings')
    .select('listing_id, listings(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data?.map((item) => item.listings)
}

export async function getConversations(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('*, messages(count), listings(title)')
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getConversationMessages(conversationId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(first_name, last_name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createOrGetConversation(
  listingId: string,
  sellerId: string,
  buyerId: string
) {
  const supabase = createClient()

  // Try to get existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', listingId)
    .eq('seller_id', sellerId)
    .eq('buyer_id', buyerId)
    .single()

  if (existing) {
    return existing
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        listing_id: listingId,
        seller_id: sellerId,
        buyer_id: buyerId,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserListings(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_media(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNotifications(userId: string, limit = 20) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()

  if (error) throw error
  return data
}

export async function createNotification(userId: string, notification: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, ...notification }])
    .select()

  if (error) throw error
  return data
}

export async function reportListing(reportData: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()

  if (error) throw error
  return data
}

export async function getSellerRating(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('seller_id', userId)

  if (error) throw error

  if (!data || data.length === 0) {
    return { average: 0, count: 0 }
  }

  const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { average: Math.round(average * 10) / 10, count: data.length }
}

export async function createReview(reviewData: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()

  if (error) throw error
  return data
}
