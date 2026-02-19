import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ==================== AUTH STORE ====================

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
  status: string;
  emailVerified: boolean;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setLoading: (isLoading) => set({ isLoading }),
        logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);

// ==================== UI STORE ====================

interface UIStore {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notificationsPanelOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setNotificationsPanelOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  notificationsPanelOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setNotificationsPanelOpen: (open) => set({ notificationsPanelOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// ==================== LISTING DRAFT STORE ====================

interface ListingDraft {
  categoryId?: string;
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  attributes?: Record<string, any>;
  location?: {
    countryId?: string;
    cityId?: string;
    districtId?: string;
    latitude?: number;
    longitude?: number;
  };
  media?: File[];
}

interface ListingStore {
  draft: ListingDraft;
  currentStep: number;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  setCurrentStep: (step: number) => void;
  clearDraft: () => void;
}

export const useListingStore = create<ListingStore>()(
  devtools(
    persist(
      (set) => ({
        draft: {},
        currentStep: 0,
        updateDraft: (updates) =>
          set((state) => ({
            draft: { ...state.draft, ...updates },
          })),
        setCurrentStep: (step) => set({ currentStep: step }),
        clearDraft: () => set({ draft: {}, currentStep: 0 }),
      }),
      {
        name: 'listing-draft-storage',
      }
    )
  )
);

// ==================== SEARCH FILTERS STORE ====================

interface SearchFilters {
  query?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  location?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'distance';
  attributes?: Record<string, any>;
}

interface SearchStore {
  filters: SearchFilters;
  savedSearches: SearchFilters[];
  updateFilters: (updates: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  saveSearch: (name: string) => void;
  loadSearch: (index: number) => void;
}

export const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      (set) => ({
        filters: {},
        savedSearches: [],
        updateFilters: (updates) =>
          set((state) => ({
            filters: { ...state.filters, ...updates },
          })),
        clearFilters: () => set({ filters: {} }),
        saveSearch: (name) =>
          set((state) => ({
            savedSearches: [...state.savedSearches, { ...state.filters }],
          })),
        loadSearch: (index) =>
          set((state) => ({
            filters: state.savedSearches[index] || {},
          })),
      }),
      {
        name: 'search-filters-storage',
      }
    )
  )
);

// ==================== CART/WISHLIST STORE ====================

interface WishlistStore {
  savedListings: string[];
  toggleSaved: (listingId: string) => void;
  isSaved: (listingId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  devtools(
    persist(
      (set, get) => ({
        savedListings: [],
        toggleSaved: (listingId) =>
          set((state) => {
            const isSaved = state.savedListings.includes(listingId);
            return {
              savedListings: isSaved
                ? state.savedListings.filter((id) => id !== listingId)
                : [...state.savedListings, listingId],
            };
          }),
        isSaved: (listingId) => get().savedListings.includes(listingId),
      }),
      {
        name: 'wishlist-storage',
      }
    )
  )
);

// ==================== NOTIFICATIONS STORE ====================

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
}));

// ==================== THEME/BRANDING STORE ====================

interface BrandingStore {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  companyName: string;
  setBranding: (branding: Partial<BrandingStore>) => void;
}

export const useBrandingStore = create<BrandingStore>((set) => ({
  primaryColor: '#3B82F6',
  secondaryColor: '#1F2937',
  accentColor: '#10B981',
  companyName: 'NexusMarket',
  setBranding: (branding) => set((state) => ({ ...state, ...branding })),
}));

// ==================== ADMIN STORE ====================

interface AdminStore {
  stats: {
    totalUsers: number;
    totalListings: number;
    totalRevenue: number;
    activeListings: number;
  } | null;
  isLoading: boolean;
  setStats: (stats: AdminStore['stats']) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  stats: null,
  isLoading: false,
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
}));
