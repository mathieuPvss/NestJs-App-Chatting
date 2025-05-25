import type { AxiosResponse } from 'axios'
import apiClient from './api'
import type { User } from '@/models/User'

export interface CreateUserDto {
  username: string
  email: string
  password: string
}

export interface UpdateUserDto {
  username?: string
  email?: string
  oldPassword?: string
  newPassword?: string
}

export const userService = {
  async create(userData: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('/users', userData)
    return response.data
  },

  async findAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users')
    return response.data
  },

  async findOne(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  async update(id: string, userData: UpdateUserDto): Promise<AxiosResponse<User>> {
    const response = await apiClient.put<User>(`/users/${id}`, userData)
    return response
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },
}
