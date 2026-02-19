import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';
import { useAuthStore } from './stores';

// ==================== AUTH HOOKS ====================

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => apiClient.register(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    queryClient.clear();
    apiClient.clearToken();
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (token: string) => apiClient.googleAuth(token),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

// ==================== USER HOOKS ====================

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });
};

export const useGetUsers = (params?: any) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiClient.getUsers(params),
    enabled: !!params,
  });
};

// ==================== LISTING HOOKS ====================

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

export const useUpdateListing = (listingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.updateListing(listingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

export const useDeleteListing = (listingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.removeQueries({ queryKey: ['listing', listingId] });
    },
  });
};

export const useGetListing = (listingId?: string) => {
  return useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => apiClient.getListing(listingId!),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetListings = (params?: any) => {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => apiClient.getListings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useSearchListings = (query: string, params?: any) => {
  return useQuery({
    queryKey: ['listings-search', query, params],
    queryFn: () => apiClient.searchListings(query, params),
    enabled: !!query,
  });
};

export const useUploadMedia = (listingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => apiClient.uploadListingMedia(listingId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
    },
  });
};

// ==================== CATEGORY HOOKS ====================

export const useGetCategories = (params?: any) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => apiClient.getCategories(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGetCategory = (categoryId?: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => apiClient.getCategory(categoryId!),
    enabled: !!categoryId,
  });
};

export const useGetCategoryAttributes = (categoryId?: string) => {
  return useQuery({
    queryKey: ['category-attributes', categoryId],
    queryFn: () => apiClient.getCategoryAttributes(categoryId!),
    enabled: !!categoryId,
  });
};

// ==================== SEARCH HOOKS ====================

export const useAdvancedSearch = (filters: any, enabled?: boolean) => {
  return useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: () => apiClient.advancedSearch(filters),
    enabled: enabled !== false && !!filters,
  });
};

export const useGeoSearch = (
  latitude?: number,
  longitude?: number,
  radius?: number,
  params?: any
) => {
  return useQuery({
    queryKey: ['geo-search', latitude, longitude, radius, params],
    queryFn: () => apiClient.geoSearch(latitude!, longitude!, radius!, params),
    enabled: !!latitude && !!longitude && !!radius,
  });
};

// ==================== PAYMENT HOOKS ====================

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (data: any) => apiClient.createCheckoutSession(data),
  });
};

export const useGetWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => apiClient.getWallet(),
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetTransactions = (params?: any) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.getTransactions(params),
  });
};

// ==================== NOTIFICATION HOOKS ====================

export const useGetNotifications = (params?: any) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => apiClient.getNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ==================== CONVERSATION HOOKS ====================

export const useGetConversations = (params?: any) => {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: () => apiClient.getConversations(params),
    staleTime: 1000 * 60,
  });
};

export const useGetConversation = (conversationId?: string) => {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => apiClient.getConversation(conversationId!),
    enabled: !!conversationId,
  });
};

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      apiClient.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) =>
      apiClient.startConversation(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// ==================== REVIEW HOOKS ====================

export const useCreateReview = (listingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.createReview(listingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
    },
  });
};

export const useGetListingReviews = (listingId?: string, params?: any) => {
  return useQuery({
    queryKey: ['listing-reviews', listingId, params],
    queryFn: () => apiClient.getListingReviews(listingId!, params),
    enabled: !!listingId,
  });
};

// ==================== ADMIN HOOKS ====================

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.getAdminStats(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAdminUsers = (params?: any) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => apiClient.getAdminUsers(params),
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiClient.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      apiClient.suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useGetReports = (params?: any) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => apiClient.getReports(params),
  });
};

export const useResolveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, action }: { reportId: string; action: string }) =>
      apiClient.resolveReport(reportId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// ==================== SUPER ADMIN HOOKS ====================

export const useGetTenants = (params?: any) => {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => apiClient.getTenants(params),
  });
};

export const useUpdateTenantBranding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string; data: any }) =>
      apiClient.updateTenantBranding(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

export const useGetSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: () => apiClient.getSystemSettings(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.updateSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
  });
};
