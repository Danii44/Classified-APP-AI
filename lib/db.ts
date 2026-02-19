import { createClient } from '@/lib/supabase/server'

export async function initializeDatabase() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.rpc('get_user_stats')
    if (error) console.error('DB init error:', error)
    return data
  } catch (error) {
    console.error('Database initialization error:', error)
    return null
  }
}

export async function getCountries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching countries:', error)
    return []
  }
  return data || []
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

export async function getCategoryAttributes(categoryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('category_attributes')
    .select('*')
    .eq('category_id', categoryId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching category attributes:', error)
    return []
  }
  return data || []
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
  return data
}

export async function getListings(filters?: any) {
  const supabase = await createClient()
  let query = supabase
    .from('ads')
    .select('*, ad_images(*), users(first_name, last_name, avatar_url, email)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.country) {
    query = query.eq('country', filters.country)
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

  const limit = filters?.limit || 20
  query = query.limit(limit)

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }
  return data || []
}

export async function getListingById(adId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .select('*, ad_images(*), users(first_name, last_name, avatar_url, email), reviews(*)')
    .eq('id', adId)
    .single()

  if (error) {
    console.error('Error fetching listing:', error)
    return null
  }
  return data
}

export async function createListing(listingData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .insert([listingData])
    .select()
    .single()

  if (error) {
    console.error('Error creating listing:', error)
    throw error
  }
  return data
}

export async function updateListing(adId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .update(updates)
    .eq('id', adId)
    .select()
    .single()

  if (error) {
    console.error('Error updating listing:', error)
    throw error
  }
  return data
}

export async function deleteListing(adId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .update({ status: 'inactive' })
    .eq('id', adId)
    .select()

  if (error) {
    console.error('Error deleting listing:', error)
    throw error
  }
  return data
}

export async function uploadMedia(adId: string, file: File) {
  const supabase = await createClient()
  const filename = `${adId}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('ads')
    .upload(filename, file)

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  const { data: urlData } = supabase.storage.from('ads').getPublicUrl(filename)

  const { data: mediaData, error: mediaError } = await supabase
    .from('ad_images')
    .insert([
      {
        ad_id: adId,
        image_url: urlData.publicUrl,
      },
    ])
    .select()
    .single()

  if (mediaError) {
    console.error('Error saving media metadata:', mediaError)
    throw mediaError
  }
  return mediaData
}

export async function saveListing(adId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_ads')
    .insert([{ ad_id: adId, user_id: userId }])
    .select()

  if (error) {
    console.error('Error saving listing:', error)
    throw error
  }
  return data
}

export async function unsaveListing(adId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('saved_ads')
    .delete()
    .eq('ad_id', adId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error removing saved listing:', error)
    throw error
  }
}

export async function getSavedListings(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_ads')
    .select('ad_id, ads(*)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved listings:', error)
    return []
  }
  return data?.map((item: any) => item.ads) || []
}

export async function getConversations(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('*, messages(count), ads(title)')
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }
  return data || []
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*, users(first_name, last_name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching conversation messages:', error)
    return []
  }
  return data || []
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const supabase = await createClient()
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

  if (error) {
    console.error('Error sending message:', error)
    throw error
  }
  return data
}

export async function createOrGetConversation(
  adId: string,
  sellerId: string,
  buyerId: string
) {
  const supabase = await createClient()

  // Try to get existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('ad_id', adId)
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
        ad_id: adId,
        seller_id: sellerId,
        buyer_id: buyerId,
        subject: 'New inquiry',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
  return data
}

export async function getUserListings(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .select('*, ad_images(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user listings:', error)
    return []
  }
  return data || []
}

export async function getSellerRating(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewed_user_id', userId)

  if (error) {
    console.error('Error fetching seller rating:', error)
    return { average: 0, count: 0 }
  }

  if (!data || data.length === 0) {
    return { average: 0, count: 0 }
  }

  const average = data.reduce((sum: number, r: any) => sum + r.rating, 0) / data.length
  return { average: Math.round(average * 10) / 10, count: data.length }
}

export async function createReview(reviewData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single()

  if (error) {
    console.error('Error creating review:', error)
    throw error
  }
  return data
}

export async function reportListing(reportData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ad_reports')
    .insert([reportData])
    .select()
    .single()

  if (error) {
    console.error('Error reporting listing:', error)
    throw error
  }
  return data
}

export async function getAdminUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('*, users(email, first_name, last_name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
  return data || []
}

export async function isUserAdmin(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single()

  if (error) return false
  return !!data
}
