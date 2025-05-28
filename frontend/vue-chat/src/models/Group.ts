import type { User } from './User'

export interface Group {
  id: string
  name: string
  ownerId: string
  members: User[]
}

export interface CreateGroupDto {
  name: string
  ownerId: string
  memberIds: string[]
}
