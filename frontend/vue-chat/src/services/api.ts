import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { authService } from './authService'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_NEST_BACKEND_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        if (!authStore.refreshToken) {
          authStore.logout()
          return Promise.reject(error)
        }
        const errorMessage = error.response.data?.message
        if (errorMessage === 'Unauthorized') {
          const response = await authService.refresh(authStore.refreshToken)

          const { access_token, refresh_token } = response.data
          authStore.setToken(access_token, refresh_token)
          authStore.initializeAuth()
          originalRequest.headers.Authorization = `Bearer ${access_token}`

          return apiClient(originalRequest)
        }
        return Promise.reject(error)
      } catch (refreshError) {
        authStore.logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
