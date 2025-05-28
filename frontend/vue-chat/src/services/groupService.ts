import api from './api'
import type { Group, CreateGroupDto } from '../models/Group'

export const groupService = {
  async createGroup(groupData: CreateGroupDto): Promise<Group> {
    const response = await api.post('/groups', groupData)
    return response.data
  },

  async getGroupById(id: string): Promise<Group> {
    const response = await api.get(`/groups/get/${id}`)
    return response.data
  },

  async getUserGroups(): Promise<Group[]> {
    const response = await api.get('/groups/user')
    return response.data
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`)
  },

  async addMember(groupId: string, userId: string): Promise<Group> {
    const response = await api.patch(`/groups/${groupId}/add/${userId}`)
    return response.data
  },

  async removeMember(groupId: string, userId: string): Promise<Group> {
    const response = await api.patch(`/groups/${groupId}/remove/${userId}`)
    return response.data
  },

  async leaveGroup(groupId: string): Promise<void> {
    await api.patch(`/groups/${groupId}/leave`)
  },
}
