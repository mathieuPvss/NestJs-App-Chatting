import type { Friendship, FriendshipStatus } from '@/models/Friendship'
import apiClient from './api'
import type { AxiosResponse } from 'axios'

export interface CreateFriendshipDto {
  recipientId: string
  requesterId: string
}

export interface GetAllFriendsResponse {
  friendshipId: string
  friend: {
    id: string
    username: string
  }
}

export interface GetSentRequestsResponse {
  recipient: string
  id: string
  status: FriendshipStatus
  requesterId: string
  recipientId: string
  requester: string
  createdAt: Date
}

export interface GetReceivedRequestsResponse {
  requester: string
  id: string
  status: FriendshipStatus
  requesterId: string
  recipientId: string
  recipient: string
  createdAt: Date
}

class FriendshipService {
  async sendFriendRequest(dto: CreateFriendshipDto): Promise<AxiosResponse<Friendship>> {
    const response = await apiClient.post<Friendship>('/friendships', dto)
    return response
  }

  async getReceivedRequests(): Promise<GetReceivedRequestsResponse[]> {
    const response = await apiClient.get<GetReceivedRequestsResponse[]>('/friendships/received')
    return response.data
  }

  async getSentRequests(): Promise<GetSentRequestsResponse[]> {
    const response = await apiClient.get<GetSentRequestsResponse[]>('/friendships/sent')
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

  async getAllFriends(): Promise<GetAllFriendsResponse[]> {
    const response = await apiClient.get<GetAllFriendsResponse[]>('/friendships')
    return response.data
  }

  async removeFriend(id: string): Promise<void> {
    await apiClient.delete(`/friendships/${id}`)
  }
}

export const friendshipService = new FriendshipService()
