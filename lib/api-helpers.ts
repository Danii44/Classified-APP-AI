import { API_ENDPOINTS } from './routes'

// ============== LISTINGS API ==============
export const listingsAPI = {
  getAll: async (filters?: any) => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category) params.append('categoryId', filters.category)
    if (filters?.country) params.append('countryId', filters.country)
    if (filters?.minPrice) params.append('priceMin', filters.minPrice)
    if (filters?.maxPrice) params.append('priceMax', filters.maxPrice)
    
    const res = await fetch(`${API_ENDPOINTS.LISTINGS.LIST}?${params}`)
    if (!res.ok) throw new Error('Failed to fetch listings')
    return res.json()
  },

  getById: async (id: string) => {
    const res = await fetch(API_ENDPOINTS.LISTINGS.GET(id))
    if (!res.ok) throw new Error('Failed to fetch listing')
    return res.json()
  },

  create: async (data: any) => {
    const res = await fetch(API_ENDPOINTS.LISTINGS.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create listing')
    return res.json()
  },

  update: async (id: string, data: any) => {
    const res = await fetch(API_ENDPOINTS.LISTINGS.UPDATE(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update listing')
    return res.json()
  },

  delete: async (id: string) => {
    const res = await fetch(API_ENDPOINTS.LISTINGS.DELETE(id), {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete listing')
    return res.json()
  },
}

// ============== PROFILE API ==============
export const profilesAPI = {
  get: async (userId: string) => {
    const res = await fetch(API_ENDPOINTS.PROFILES.GET(userId))
    if (!res.ok) throw new Error('Failed to fetch profile')
    return res.json()
  },

  update: async (userId: string, data: any) => {
    const res = await fetch(API_ENDPOINTS.PROFILES.UPDATE(userId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update profile')
    return res.json()
  },

  getListings: async (userId: string) => {
    const res = await fetch(API_ENDPOINTS.PROFILES.GET_LISTINGS(userId))
    if (!res.ok) throw new Error('Failed to fetch user listings')
    return res.json()
  },

  getRating: async (userId: string) => {
    const res = await fetch(API_ENDPOINTS.PROFILES.GET_RATING(userId))
    if (!res.ok) throw new Error('Failed to fetch user rating')
    return res.json()
  },
}

// ============== CONVERSATIONS API ==============
export const conversationsAPI = {
  getAll: async () => {
    const res = await fetch(API_ENDPOINTS.CONVERSATIONS.LIST)
    if (!res.ok) throw new Error('Failed to fetch conversations')
    return res.json()
  },

  get: async (id: string) => {
    const res = await fetch(API_ENDPOINTS.CONVERSATIONS.GET(id))
    if (!res.ok) throw new Error('Failed to fetch conversation')
    return res.json()
  },

  create: async (recipientId: string) => {
    const res = await fetch(API_ENDPOINTS.CONVERSATIONS.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId }),
    })
    if (!res.ok) throw new Error('Failed to create conversation')
    return res.json()
  },

  sendMessage: async (conversationId: string, message: string) => {
    const res = await fetch(API_ENDPOINTS.CONVERSATIONS.SEND_MESSAGE(conversationId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error('Failed to send message')
    return res.json()
  },
}

// ============== METADATA API ==============
export const metadataAPI = {
  getCountries: async () => {
    const res = await fetch(API_ENDPOINTS.METADATA.COUNTRIES)
    if (!res.ok) throw new Error('Failed to fetch countries')
    return res.json()
  },

  getCategories: async () => {
    const res = await fetch(API_ENDPOINTS.METADATA.CATEGORIES)
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  },

  getAttributes: async (categoryId: string) => {
    const res = await fetch(API_ENDPOINTS.METADATA.ATTRIBUTES(categoryId))
    if (!res.ok) throw new Error('Failed to fetch attributes')
    return res.json()
  },
}

// ============== AUTH API ==============
export const authAPI = {
  signup: async (email: string, password: string, name: string) => {
    const res = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) throw new Error('Failed to sign up')
    return res.json()
  },

  login: async (email: string, password: string) => {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Failed to login')
    return res.json()
  },

  logout: async () => {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    })
    if (!res.ok) throw new Error('Failed to logout')
    return res.json()
  },
}

// ============== ERROR HANDLER ==============
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// ============== REQUEST HELPER ==============
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API call failed')
  }

  return response.json() as Promise<T>
}
