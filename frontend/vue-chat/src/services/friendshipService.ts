import type { Friendship } from '@/models/Friendship'
import apiClient from './api'

export interface CreateFriendshipDto {
  recipientId: string
  requesterId: string
}

class FriendshipService {
  async sendFriendRequest(dto: CreateFriendshipDto): Promise<Friendship> {
    const response = await apiClient.post<Friendship>('/friendships', dto)
    return response.data
  }

  async getReceivedRequests(): Promise<Friendship[]> {
    const response = await apiClient.get<Friendship[]>('/friendships/received')
    return response.data
  }

  async getSentRequests(): Promise<Friendship[]> {
    const response = await apiClient.get<Friendship[]>('/friendships/sent')
    return response.data
  }

  async acceptFriendRequest(id: string): Promise<Friendship> {
    const response = await apiClient.put<Friendship>(`/friendships/${id}/accept`)
    return response.data
  }

  async rejectFriendRequest(id: string): Promise<Friendship> {
    const response = await apiClient.put<Friendship>(`/friendships/${id}/reject`)
    return response.data
  }

  async getAllFriends(): Promise<Friendship[]> {
    const response = await apiClient.get<Friendship[]>('/friendships')
    return response.data
  }

  async removeFriend(id: string): Promise<void> {
    await apiClient.delete(`/friendships/${id}`)
  }
}

export const friendshipService = new FriendshipService()
