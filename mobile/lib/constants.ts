// ============== COLORS ==============
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#1F2937',
  accent: '#10B981',
  danger: '#EF4444',
  warning: '#FBBF24',
  success: '#10B981',
  info: '#3B82F6',
  
  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Backgrounds
  bgDark: '#0F172A',
  bgLight: '#FFFFFF',
  bgCard: '#1F2937',
}

// ============== TYPOGRAPHY ==============
export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    normal: '400' as any,
    medium: '500' as any,
    semibold: '600' as any,
    bold: '700' as any,
  },
}

// ============== SPACING ==============
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
}

// ============== BORDER RADIUS ==============
export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
}

// ============== SHADOW ==============
export const SHADOW = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  md: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lg: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.65,
  },
}

// ============== CATEGORY ICONS ==============
export const CATEGORY_ICONS: Record<string, string> = {
  electronics: '📱',
  vehicles: '🚗',
  furniture: '🛋️',
  fashion: '👕',
  books: '📚',
  home: '🏠',
  sports: '⚽',
  toys: '🎮',
  food: '🍕',
  beauty: '💄',
  pets: '🐕',
  services: '🔧',
}

// ============== CURRENCY ==============
export const CURRENCIES = {
  AED: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham' },
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  SAR: { symbol: 'ر.س', code: 'SAR', name: 'Saudi Riyal' },
  KWD: { symbol: 'د.ك', code: 'KWD', name: 'Kuwaiti Dinar' },
}

// ============== LISTING STATUS ==============
export const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  DRAFT: 'draft',
  EXPIRED: 'expired',
  INACTIVE: 'inactive',
}

// ============== SUBSCRIPTION TIERS ==============
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
}

// ============== FEATURE FLAGS ==============
export const FEATURE_FLAGS = {
  ENABLE_PAYMENTS: true,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_MESSAGING: true,
  ENABLE_FEATURED_LISTINGS: true,
  ENABLE_REVIEWS: true,
  ENABLE_ADVANCED_SEARCH: true,
}

// ============== API TIMEOUTS ==============
export const API_TIMEOUTS = {
  SHORT: 5000,
  NORMAL: 10000,
  LONG: 30000,
}

// ============== VALIDATION ==============
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[0-9]{10,}$/,
  PASSWORD_MIN_LENGTH: 6,
  TITLE_MIN_LENGTH: 5,
  DESCRIPTION_MIN_LENGTH: 20,
  PRICE_MIN: 0,
  PRICE_MAX: 999999999,
}

// ============== ROUTES ==============
export const MOBILE_ROUTES = {
  HOME: 'home',
  SEARCH: 'search',
  CREATE: 'create',
  MESSAGES: 'messages',
  PROFILE: 'profile',
  FAVORITES: 'favorites',
  LOGIN: 'login',
  SIGNUP: 'signup',
}

// ============== PAGINATION ==============
export const PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 0,
}
