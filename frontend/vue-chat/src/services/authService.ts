import apiClient from './api'

export const authService = {
  login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password })
  },
  register(email: string, password: string, username: string) {
    return apiClient.post('/auth/register', { email, password, username })
  },
  refresh(refreshToken: string) {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken })
  },
}
