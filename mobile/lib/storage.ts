import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  USER: 'user_data',
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  FAVORITE_LISTINGS: 'favorite_listings',
  SEARCH_HISTORY: 'search_history',
  DRAFT_LISTING: 'draft_listing',
}

// ============== USER STORAGE ==============
export const userStorage = {
  setUser: async (user: any) => {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user))
  },

  getUser: async () => {
    const data = await AsyncStorage.getItem(KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  clearUser: async () => {
    await AsyncStorage.removeItem(KEYS.USER)
  },
}

// ============== AUTH STORAGE ==============
export const tokenStorage = {
  setToken: async (token: string) => {
    await AsyncStorage.setItem(KEYS.TOKEN, token)
  },

  getToken: async () => {
    return await AsyncStorage.getItem(KEYS.TOKEN)
  },

  setRefreshToken: async (token: string) => {
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token)
  },

  getRefreshToken: async () => {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN)
  },

  clearTokens: async () => {
    await AsyncStorage.removeItem(KEYS.TOKEN)
    await AsyncStorage.removeItem(KEYS.REFRESH_TOKEN)
  },
}

// ============== PREFERENCES STORAGE ==============
export const preferencesStorage = {
  setPreferences: async (prefs: any) => {
    await AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(prefs))
  },

  getPreferences: async () => {
    const data = await AsyncStorage.getItem(KEYS.USER_PREFERENCES)
    return data ? JSON.parse(data) : {}
  },

  updatePreference: async (key: string, value: any) => {
    const prefs = await preferencesStorage.getPreferences()
    prefs[key] = value
    await preferencesStorage.setPreferences(prefs)
  },
}

// ============== FAVORITES STORAGE ==============
export const favoritesStorage = {
  addFavorite: async (listingId: string) => {
    const favorites = await favoritesStorage.getFavorites()
    if (!favorites.includes(listingId)) {
      favorites.push(listingId)
      await AsyncStorage.setItem(KEYS.FAVORITE_LISTINGS, JSON.stringify(favorites))
    }
  },

  removeFavorite: async (listingId: string) => {
    const favorites = await favoritesStorage.getFavorites()
    const updated = favorites.filter((id) => id !== listingId)
    await AsyncStorage.setItem(KEYS.FAVORITE_LISTINGS, JSON.stringify(updated))
  },

  getFavorites: async () => {
    const data = await AsyncStorage.getItem(KEYS.FAVORITE_LISTINGS)
    return data ? JSON.parse(data) : []
  },

  isFavorite: async (listingId: string) => {
    const favorites = await favoritesStorage.getFavorites()
    return favorites.includes(listingId)
  },
}

// ============== SEARCH HISTORY ==============
export const searchHistoryStorage = {
  addSearch: async (query: string) => {
    const history = await searchHistoryStorage.getHistory()
    const filtered = history.filter((q) => q !== query)
    const updated = [query, ...filtered].slice(0, 10)
    await AsyncStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated))
  },

  getHistory: async () => {
    const data = await AsyncStorage.getItem(KEYS.SEARCH_HISTORY)
    return data ? JSON.parse(data) : []
  },

  clearHistory: async () => {
    await AsyncStorage.removeItem(KEYS.SEARCH_HISTORY)
  },
}

// ============== DRAFT LISTING ==============
export const draftListingStorage = {
  saveDraft: async (listing: any) => {
    await AsyncStorage.setItem(KEYS.DRAFT_LISTING, JSON.stringify(listing))
  },

  getDraft: async () => {
    const data = await AsyncStorage.getItem(KEYS.DRAFT_LISTING)
    return data ? JSON.parse(data) : null
  },

  clearDraft: async () => {
    await AsyncStorage.removeItem(KEYS.DRAFT_LISTING)
  },
}

// ============== GENERAL CLEAR ==============
export async function clearAllStorage() {
  await AsyncStorage.clear()
}

export async function clearAuthStorage() {
  await tokenStorage.clearTokens()
  await userStorage.clearUser()
}
