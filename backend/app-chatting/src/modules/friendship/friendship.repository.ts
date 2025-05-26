import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Friendship, FriendshipStatus } from './entities/friendship.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class FriendshipRepository {
  constructor(
    @InjectRepository(Friendship)
    private readonly repo: Repository<Friendship>,
  ) {}

  async createFriendship(
    requester: User,
    recipient: User,
  ): Promise<Friendship> {
    const friendship = this.repo.create({
      recipientId: recipient.id,
      requesterId: requester.id,
      status: FriendshipStatus.PENDING,
      requester,
      recipient,
    });
    return this.repo.save(friendship);
  }

  async findById(id: string): Promise<Friendship | null> {
    return this.repo.findOne({
      where: { id },
    });
  }

  async findFriendRequest(recipientId: string): Promise<Friendship[] | null> {
    return this.repo.find({
      where: {
        recipientId: recipientId,
        status: FriendshipStatus.PENDING,
      },
      relations: ['requester'],
    });
  }

  async findMyFriendRequest(requesterId: string): Promise<Friendship[] | null> {
    return this.repo.find({
      where: {
        requesterId: requesterId,
        status: FriendshipStatus.PENDING,
      },
      relations: ['recipient'],
    });
  }

  async updateFriendshipStatus(
    id: string,
    status: FriendshipStatus,
  ): Promise<Friendship> {
    await this.repo.update(id, { status });
    return this.findById(id);
  }

  async deleteFriendship(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findAllFriends(
    userId: string,
  ): Promise<{ friendshipId: string; friend: Partial<User> }[]> {
    const friendships = await this.repo.find({
      where: [
        { requesterId: userId, status: FriendshipStatus.ACCEPTED },
        { recipientId: userId, status: FriendshipStatus.ACCEPTED },
      ],
      relations: ['requester', 'recipient'],
    });

    return friendships.map((friendship) => {
      const friend =
        friendship.requesterId === userId
          ? friendship.recipient
          : friendship.requester;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, username } = friend;
      return {
        friendshipId: friendship.id,
        friend: {
          id,
          username,
        },
      };
    });
  }

  async findExistingFriendship(
    userId1: string,
    userId2: string,
  ): Promise<Friendship | null> {
    return this.repo.findOne({
      where: [
        {
          requesterId: userId1,
          recipientId: userId2,
          status: Not(FriendshipStatus.REJECTED),
        },
        {
          requesterId: userId2,
          recipientId: userId1,
          status: Not(FriendshipStatus.REJECTED),
        },
      ],
    });
  }
}
