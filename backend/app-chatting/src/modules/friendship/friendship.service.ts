import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { Friendship, FriendshipStatus } from './entities/friendship.entity';
import { FriendshipRepository } from './friendship.repository';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly friendshipRepo: FriendshipRepository,
    private readonly userService: UsersService,
  ) {}

  async sendFriendRequest(
    newFriendship: CreateFriendshipDto,
  ): Promise<Friendship> {
    const recipient = await this.userService.findOne(newFriendship.recipientId);
    const requester = await this.userService.findOne(newFriendship.requesterId);

    if (!recipient || !requester) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const existing = await this.friendshipRepo.findExistingFriendship(
      requester.id,
      recipient.id,
    );

    if (existing) {
      throw new ConflictException(
        'Une demande ou une amitié existe déjà entre ces utilisateurs',
      );
    }

    return this.friendshipRepo.createFriendship(requester, recipient);
  }

  async getFriendRequestById(id: string): Promise<Friendship> {
    const friendship = await this.friendshipRepo.findById(id);
    if (!friendship) throw new NotFoundException('Demande non trouvée');
    return friendship;
  }

  async getReceivedFriendRequests(
    userId: string,
  ): Promise<Friendship[] | null> {
    return this.friendshipRepo.findFriendRequest(userId);
  }

  async getSentFriendRequests(userId: string): Promise<Friendship[] | null> {
    return this.friendshipRepo.findMyFriendRequest(userId);
  }

  async acceptFriendRequest(id: string, userId: string): Promise<Friendship> {
    const friendship = await this.friendshipRepo.findById(id);
    if (!friendship) {
      throw new NotFoundException('Demande introuvable');
    }
    if (friendship.recipientId !== userId) {
      throw new NotFoundException(
        "Vous n'êtes pas le destinataire de cette demande",
      );
    }
    return this.friendshipRepo.updateFriendshipStatus(
      id,
      FriendshipStatus.ACCEPTED,
    );
  }

  async rejectFriendRequest(id: string, userId: string): Promise<Friendship> {
    const friendship = await this.friendshipRepo.findById(id);
    if (!friendship) {
      throw new NotFoundException('Demande introuvable');
    }
    if (friendship.recipientId !== userId) {
      throw new NotFoundException(
        "Vous n'êtes pas le destinataire de cette demande",
      );
    }
    if (friendship.status === FriendshipStatus.ACCEPTED) {
      throw new ConflictException('Cette demande a déjà été acceptée');
    }

    return this.friendshipRepo.updateFriendshipStatus(
      id,
      FriendshipStatus.REJECTED,
    );
  }

  async removeFriend(id: string, userId: string): Promise<void> {
    const friendship = await this.friendshipRepo.findById(id);
    if (!friendship) {
      throw new NotFoundException('Demande introuvable');
    }
    if (
      friendship.requesterId !== userId &&
      friendship.recipientId !== userId
    ) {
      throw new NotFoundException(
        "Vous n'êtes pas le demandeur ou le destinataire de cette demande",
      );
    }

    await this.friendshipRepo.deleteFriendship(id);
  }

  async getAllFriends(
    userId: string,
  ): Promise<{ friendshipId: string; friend: Partial<User> }[]> {
    return this.friendshipRepo.findAllFriends(userId);
  }
}
