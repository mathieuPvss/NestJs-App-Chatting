export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Friendship {
  id: string
  status: FriendshipStatus
  requesterId: string
  recipientId: string
  createdAt: string
}
