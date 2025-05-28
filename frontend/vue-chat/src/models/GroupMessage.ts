import type { User } from './User'

export interface GroupMessage {
  id: string
  content: string
  createdAt: string
  senderId: string
  groupId: string
  sender: User
}
