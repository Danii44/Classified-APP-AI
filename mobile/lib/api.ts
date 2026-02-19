import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = 'http://localhost:3000' // Change to your API URL

class MobileAPIClient {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message = error.response?.data?.message || error.message
        return Promise.reject(new Error(message))
      }
    )
  }

  // ============== LISTINGS ==============
  async getListings(filters?: any) {
    return this.api.get('/api/listings', { params: filters })
  }

  async getListing(id: string) {
    return this.api.get(`/api/listings/${id}`)
  }

  async createListing(data: any) {
    return this.api.post('/api/listings/create', data)
  }

  async updateListing(id: string, data: any) {
    return this.api.put(`/api/listings/${id}`, data)
  }

  async deleteListing(id: string) {
    return this.api.delete(`/api/listings/${id}`)
  }

  // ============== AUTH ==============
  async signup(email: string, password: string, name: string) {
    return this.api.post('/api/auth/sign-up', { email, password, name })
  }

  async login(email: string, password: string) {
    return this.api.post('/api/auth/login', { email, password })
  }

  async logout() {
    return this.api.post('/api/auth/logout')
  }

  // ============== PROFILE ==============
  async getProfile(userId: string) {
    return this.api.get(`/api/profiles/${userId}`)
  }

  async updateProfile(userId: string, data: any) {
    return this.api.put(`/api/profiles/${userId}`, data)
  }

  async getUserListings(userId: string) {
    return this.api.get(`/api/users/${userId}/listings`)
  }

  // ============== MESSAGES ==============
  async getConversations() {
    return this.api.get('/api/conversations')
  }

  async getConversation(id: string) {
    return this.api.get(`/api/conversations/${id}`)
  }

  async sendMessage(conversationId: string, message: string) {
    return this.api.post(`/api/conversations/${conversationId}`, { message })
  }

  // ============== METADATA ==============
  async getCountries() {
    return this.api.get('/api/metadata?type=countries')
  }

  async getCategories() {
    return this.api.get('/api/metadata?type=categories')
  }

  async getAttributes(categoryId: string) {
    return this.api.get(`/api/metadata?type=attributes&categoryId=${categoryId}`)
  }

  // ============== SEARCH ==============
  async search(query: string, filters?: any) {
    return this.api.get('/api/listings', {
      params: {
        search: query,
        ...filters,
      },
    })
  }
}

export const apiClient = new MobileAPIClient()
