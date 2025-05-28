import {
  Friendship,
  FriendshipStatus,
} from '../modules/friendship/entities/friendship.entity';

export const friendships: Partial<Friendship>[] = [
  {
    status: FriendshipStatus.ACCEPTED,
  },
  {
    status: FriendshipStatus.PENDING,
  },
  {
    status: FriendshipStatus.ACCEPTED,
  },
];
