import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, attempt refresh
          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              return this.client.request(error.config);
            }
          } catch (refreshError) {
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );

    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      this.setToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  // ==================== AUTH ENDPOINTS ====================

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  async register(data: any) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async googleAuth(token: string) {
    const response = await this.client.post('/auth/google', { token });
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  async requestOTP(email: string) {
    const response = await this.client.post('/auth/otp/request', { email });
    return response.data;
  }

  async verifyOTP(email: string, code: string) {
    const response = await this.client.post('/auth/otp/verify', { email, code });
    this.setToken(response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }

  // ==================== USER ENDPOINTS ====================

  async getCurrentUser() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.patch('/users/profile', data);
    return response.data;
  }

  async getUserById(userId: string) {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  async getUsers(params?: any) {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  // ==================== LISTING ENDPOINTS ====================

  async createListing(data: any) {
    const response = await this.client.post('/listings', data);
    return response.data;
  }

  async updateListing(id: string, data: any) {
    const response = await this.client.patch(`/listings/${id}`, data);
    return response.data;
  }

  async getListing(id: string) {
    const response = await this.client.get(`/listings/${id}`);
    return response.data;
  }

  async getListings(params?: any) {
    const response = await this.client.get('/listings', { params });
    return response.data;
  }

  async deleteListing(id: string) {
    const response = await this.client.delete(`/listings/${id}`);
    return response.data;
  }

  async searchListings(query: string, params?: any) {
    const response = await this.client.get('/listings/search', {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async uploadListingMedia(listingId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await this.client.post(
      `/listings/${listingId}/media`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  }

  // ==================== CATEGORY ENDPOINTS ====================

  async getCategories(params?: any) {
    const response = await this.client.get('/categories', { params });
    return response.data;
  }

  async getCategory(id: string) {
    const response = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  async getCategoryAttributes(categoryId: string) {
    const response = await this.client.get(`/categories/${categoryId}/attributes`);
    return response.data;
  }

  // ==================== SEARCH ENDPOINTS ====================

  async advancedSearch(filters: any) {
    const response = await this.client.post('/search/advanced', filters);
    return response.data;
  }

  async geoSearch(latitude: number, longitude: number, radius: number, params?: any) {
    const response = await this.client.get('/search/geo', {
      params: { latitude, longitude, radius, ...params },
    });
    return response.data;
  }

  // ==================== PAYMENT ENDPOINTS ====================

  async createCheckoutSession(data: any) {
    const response = await this.client.post('/payments/checkout', data);
    return response.data;
  }

  async getTransactions(params?: any) {
    const response = await this.client.get('/payments/transactions', { params });
    return response.data;
  }

  async getWallet() {
    const response = await this.client.get('/payments/wallet');
    return response.data;
  }

  // ==================== NOTIFICATION ENDPOINTS ====================

  async getNotifications(params?: any) {
    const response = await this.client.get('/notifications', { params });
    return response.data;
  }

  async markNotificationRead(id: string) {
    const response = await this.client.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await this.client.patch('/notifications/read-all');
    return response.data;
  }

  // ==================== CONVERSATION ENDPOINTS ====================

  async getConversations(params?: any) {
    const response = await this.client.get('/conversations', { params });
    return response.data;
  }

  async getConversation(id: string) {
    const response = await this.client.get(`/conversations/${id}`);
    return response.data;
  }

  async sendMessage(conversationId: string, content: string) {
    const response = await this.client.post(`/conversations/${conversationId}/messages`, {
      content,
    });
    return response.data;
  }

  async startConversation(participantId: string) {
    const response = await this.client.post('/conversations', { participantId });
    return response.data;
  }

  // ==================== REVIEW ENDPOINTS ====================

  async createReview(listingId: string, data: any) {
    const response = await this.client.post(`/listings/${listingId}/reviews`, data);
    return response.data;
  }

  async getListingReviews(listingId: string, params?: any) {
    const response = await this.client.get(`/listings/${listingId}/reviews`, { params });
    return response.data;
  }

  // ==================== ADMIN ENDPOINTS ====================

  async getAdminStats() {
    const response = await this.client.get('/admin/stats');
    return response.data;
  }

  async getAdminUsers(params?: any) {
    const response = await this.client.get('/admin/users', { params });
    return response.data;
  }

  async updateUserRole(userId: string, role: string) {
    const response = await this.client.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async suspendUser(userId: string, reason: string) {
    const response = await this.client.post(`/admin/users/${userId}/suspend`, { reason });
    return response.data;
  }

  async getReports(params?: any) {
    const response = await this.client.get('/admin/reports', { params });
    return response.data;
  }

  async resolveReport(reportId: string, action: string) {
    const response = await this.client.post(`/admin/reports/${reportId}/resolve`, { action });
    return response.data;
  }

  // ==================== SUPER ADMIN ENDPOINTS ====================

  async getTenants(params?: any) {
    const response = await this.client.get('/super-admin/tenants', { params });
    return response.data;
  }

  async updateTenantBranding(tenantId: string, data: any) {
    const response = await this.client.patch(`/super-admin/tenants/${tenantId}/branding`, data);
    return response.data;
  }

  async getSystemSettings() {
    const response = await this.client.get('/super-admin/settings');
    return response.data;
  }

  async updateSystemSettings(data: any) {
    const response = await this.client.patch('/super-admin/settings', data);
    return response.data;
  }
}

export const apiClient = new APIClient();
