import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { authService } from '@/services/authService'
import type { User, Role } from '@/models/User'

interface JwtPayload {
  sub: string
  email: string
  role: Role
  username: string
  iat?: number
  exp?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    refreshToken: localStorage.getItem('refreshToken') as string | null,
    user: null as User | null,
    isLoadingUser: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
    currentToken: (state) => state.token,
    currentRefreshToken: (state) => state.refreshToken,
    userRole: (state) => state.user?.role,
    isLoading: (state) => state.isLoadingUser,
  },

  actions: {
    initializeAuth() {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      if (token && refreshToken) {
        this.token = token
        this.refreshToken = refreshToken
        this.decodeToken()
      } else {
        this.user = null
        this.token = null
        this.refreshToken = null
      }
    },

    decodeToken() {
      if (!this.token) {
        return
      }
      const decodedToken = jwtDecode<JwtPayload>(this.token)
      this.user = {
        id: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
        username: decodedToken.username,
      }
    },

    setToken(newToken: string | null, newRefreshToken: string | null) {
      this.token = newToken
      this.refreshToken = newRefreshToken
      if (newToken) {
        localStorage.setItem('token', newToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        this.user = null
        this.refreshToken = null
      }
    },

    async login(email: string, password: string) {
      this.isLoadingUser = true
      try {
        const response = await authService.login(email, password)
        this.setToken(response.data.access_token, response.data.refresh_token)
        this.user = response.data.user
        return { success: true }
      } catch (error) {
        console.error('Login failed:', error)
        this.setToken(null, null)
        throw error
      } finally {
        this.isLoadingUser = false
      }
    },

    async logout() {
      this.setToken(null, null)
      this.user = null
    },
  },
})
