import { PUBLIC_ROUTES, AUTH_ROUTES, LISTING_ROUTES, PAYMENT_ROUTES, ADMIN_ROUTES } from './routes'

// ============== NAVIGATION HELPERS ==============
export const navLinks = {
  // Main navigation
  home: () => PUBLIC_ROUTES.HOME,
  login: () => PUBLIC_ROUTES.LOGIN,
  signup: () => PUBLIC_ROUTES.SIGNUP,
  
  // User authenticated routes
  dashboard: () => AUTH_ROUTES.DASHBOARD,
  profile: () => AUTH_ROUTES.PROFILE,
  messages: () => AUTH_ROUTES.MESSAGES,
  favorites: () => AUTH_ROUTES.FAVORITES,
  myListings: () => AUTH_ROUTES.MY_LISTINGS,
  
  // Listing routes
  createListing: () => LISTING_ROUTES.CREATE,
  listingDetail: (id: string) => LISTING_ROUTES.DETAIL(id),
  editListing: (id: string) => LISTING_ROUTES.EDIT(id),
  search: () => LISTING_ROUTES.SEARCH,
  
  // Payment routes
  subscribe: () => PAYMENT_ROUTES.SUBSCRIBE,
  billing: () => PAYMENT_ROUTES.BILLING,
  paymentSuccess: () => PAYMENT_ROUTES.PAYMENT_SUCCESS,
  paymentCancel: () => PAYMENT_ROUTES.PAYMENT_CANCEL,
  
  // Admin routes
  admin: () => ADMIN_ROUTES.ADMIN,
  adminUsers: () => ADMIN_ROUTES.ADMIN_USERS,
  adminListings: () => ADMIN_ROUTES.ADMIN_LISTINGS,
  adminPayments: () => ADMIN_ROUTES.ADMIN_PAYMENTS,
  adminSettings: () => ADMIN_ROUTES.ADMIN_SETTINGS,
  adminReports: () => ADMIN_ROUTES.ADMIN_REPORTS,
}

// ============== CATEGORY NAVIGATION ==============
export const categoryNavigation = (categoryId?: string, countryId?: string) => {
  let url = LISTING_ROUTES.SEARCH
  const params = new URLSearchParams()
  
  if (categoryId) params.append('category', categoryId)
  if (countryId) params.append('country', countryId)
  
  if (params.toString()) {
    url += `?${params.toString()}`
  }
  
  return url
}

// ============== PROFILE NAVIGATION ==============
export const profileNavigation = (userId: string) => ({
  view: () => `/profiles/${userId}`,
  listings: () => `/profiles/${userId}/listings`,
  reviews: () => `/profiles/${userId}/reviews`,
  message: () => `/messages?user=${userId}`,
})

// ============== LISTING NAVIGATION ==============
export const listingNavigation = (listingId: string) => ({
  view: () => LISTING_ROUTES.DETAIL(listingId),
  edit: () => LISTING_ROUTES.EDIT(listingId),
  report: () => `${LISTING_ROUTES.DETAIL(listingId)}?action=report`,
  share: (platform: 'whatsapp' | 'facebook' | 'twitter') => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}${LISTING_ROUTES.DETAIL(listingId)}`
    const encoded = encodeURIComponent(url)
    
    switch (platform) {
      case 'whatsapp':
        return `https://wa.me/?text=${encoded}`
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encoded}`
      default:
        return url
    }
  },
})

// ============== MOBILE NAVIGATION ==============
export const mobileNavigation = {
  home: '/',
  search: '/search',
  createListing: '/create',
  messages: '/messages',
  profile: '/profile',
  favoritesTab: '/favorites',
}

// ============== BREADCRUMB HELPER ==============
export function getBreadcrumbs(path: string) {
  const parts = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'Home', href: PUBLIC_ROUTES.HOME },
  ]
  
  let currentPath = ''
  parts.forEach((part) => {
    currentPath += `/${part}`
    const label = part
      .replace('-', ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({ label, href: currentPath })
  })
  
  return breadcrumbs
}

// ============== REDIRECT HELPERS ==============
export const redirects = {
  afterLogin: () => AUTH_ROUTES.DASHBOARD,
  afterSignup: () => PUBLIC_ROUTES.SIGNUP_SUCCESS,
  afterLogout: () => PUBLIC_ROUTES.HOME,
  afterListingCreate: (id: string) => LISTING_ROUTES.DETAIL(id),
  afterPayment: () => PAYMENT_ROUTES.PAYMENT_SUCCESS,
  onError: () => PUBLIC_ROUTES.AUTH_ERROR,
}

// ============== QUERY PARAMETER HELPERS ==============
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function parseQueryString(query: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(query)
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}
