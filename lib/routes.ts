// ============== PUBLIC ROUTES ==============
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/sign-up',
  SIGNUP_SUCCESS: '/auth/sign-up-success',
  AUTH_ERROR: '/auth/error',
  PROTECTED: '/protected',
  LISTING_DETAIL: (id: string) => `/listings/${id}`,
}

// ============== AUTHENTICATED ROUTES ==============
export const AUTH_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  MESSAGES: '/messages',
  FAVORITES: '/favorites',
  MY_LISTINGS: '/my-listings',
}

// ============== ADMIN ROUTES ==============
export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_REPORTS: '/admin/reports',
}

// ============== LISTING ROUTES ==============
export const LISTING_ROUTES = {
  CREATE: '/listings/create',
  EDIT: (id: string) => `/listings/${id}/edit`,
  DETAIL: (id: string) => `/listings/${id}`,
  MY_LISTINGS: '/my-listings',
  SEARCH: '/search',
}

// ============== PAYMENT ROUTES ==============
export const PAYMENT_ROUTES = {
  SUBSCRIBE: '/subscribe',
  BILLING: '/billing',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_CANCEL: '/payment/cancel',
}

// ============== API ENDPOINTS ==============
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/sign-up',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
  },
  
  // Listings
  LISTINGS: {
    LIST: '/api/listings',
    GET: (id: string) => `/api/listings/${id}`,
    CREATE: '/api/listings/create',
    UPDATE: (id: string) => `/api/listings/${id}`,
    DELETE: (id: string) => `/api/listings/${id}`,
  },
  
  // Profiles
  PROFILES: {
    GET: (id: string) => `/api/profiles/${id}`,
    UPDATE: (id: string) => `/api/profiles/${id}`,
    GET_LISTINGS: (id: string) => `/api/users/${id}/listings`,
    GET_RATING: (id: string) => `/api/users/${id}/rating`,
  },
  
  // Messages & Conversations
  CONVERSATIONS: {
    LIST: '/api/conversations',
    GET: (id: string) => `/api/conversations/${id}`,
    CREATE: '/api/conversations',
    SEND_MESSAGE: (id: string) => `/api/conversations/${id}/message`,
  },
  
  // Metadata
  METADATA: {
    COUNTRIES: '/api/metadata?type=countries',
    CATEGORIES: '/api/metadata?type=categories',
    ATTRIBUTES: (catId: string) => `/api/metadata?type=attributes&categoryId=${catId}`,
  },
}

// ============== HELPER FUNCTIONS ==============
export function isPublicRoute(path: string): boolean {
  const publicPaths = [
    PUBLIC_ROUTES.HOME,
    PUBLIC_ROUTES.LOGIN,
    PUBLIC_ROUTES.SIGNUP,
    PUBLIC_ROUTES.SIGNUP_SUCCESS,
    PUBLIC_ROUTES.AUTH_ERROR,
  ]
  return publicPaths.includes(path)
}

export function isAuthRoute(path: string): boolean {
  return path.startsWith('/auth')
}

export function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin')
}

export function isProtectedRoute(path: string): boolean {
  return !isPublicRoute(path) && !isAuthRoute(path)
}
