import type { User } from './User'

export interface Message {
  id: string
  content: string
  senderId: string
  recipientId: string
  createdAt: Date
  sender: User
  recipient: User
}
