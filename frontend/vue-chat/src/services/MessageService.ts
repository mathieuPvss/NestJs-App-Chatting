import apiClient from './api'
import type { Message } from '@/models/Message'

export interface CreateMessageDto {
  content: string
  receiverId: string
}

class MessageService {
  async getConversation(userId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/messages/conversation/${userId}`)
    return response.data
  }

  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/messages/${messageId}`)
  }
}

export const messageService = new MessageService()
