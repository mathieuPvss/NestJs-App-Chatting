import apiClient from './api'
import type { GroupMessage } from '@/models/GroupMessage'

export interface CreateGroupMessageDto {
  content: string
  groupId: string
}

class GroupMessageService {
  async getGroupMessages(groupId: string): Promise<GroupMessage[]> {
    const response = await apiClient.get<GroupMessage[]>(`/group-messages/group/${groupId}`)
    return response.data
  }

  async createMessage(dto: CreateGroupMessageDto): Promise<GroupMessage> {
    const response = await apiClient.post<GroupMessage>('/group-messages', dto)
    return response.data
  }

  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/group-messages/${messageId}`)
  }
}

export const groupMessageService = new GroupMessageService()
