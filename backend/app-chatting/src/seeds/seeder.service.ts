import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Group } from '../modules/group/entities/group.entity';
import { Message } from '../modules/messages/entities/message.entity';
import { Friendship } from '../modules/friendship/entities/friendship.entity';
import { GroupMessage } from '../modules/group-message/entities/group-message.entity';
import { users } from './user.seed';
import { groups } from './group.seed';
import { messages } from './message.seed';
import { friendships } from './friendship.seed';
import { groupMessages } from './group-message.seed';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
  ) {}

  async seed() {
    try {
      // Seed Users
      const createdUsers = await Promise.all(
        users.map(async (userData) => {
          const user = this.userRepository.create(userData);
          return this.userRepository.save(user);
        }),
      );

      // Seed Groups
      const createdGroups = await Promise.all(
        groups.map(async (groupData) => {
          const group = this.groupRepository.create({
            ...groupData,
            owner: createdUsers[1], // user 1 is the owner
            ownerId: createdUsers[1].id,
            members: createdUsers,
          });
          return this.groupRepository.save(group);
        }),
      );

      // Seed Messages
      await Promise.all(
        messages.map(async (messageData, index) => {
          const message = this.messageRepository.create({
            ...messageData,
            sender: createdUsers[index % createdUsers.length],
            senderId: createdUsers[index % createdUsers.length].id,
            recipient: createdUsers[(index + 1) % createdUsers.length],
            recipientId: createdUsers[(index + 1) % createdUsers.length].id,
          });
          return this.messageRepository.save(message);
        }),
      );

      // Seed Friendships
      await Promise.all(
        friendships.map(async (friendshipData, index) => {
          const friendship = this.friendshipRepository.create({
            ...friendshipData,
            requester: createdUsers[index % createdUsers.length],
            requesterId: createdUsers[index % createdUsers.length].id,
            recipient: createdUsers[(index + 1) % createdUsers.length],
            recipientId: createdUsers[(index + 1) % createdUsers.length].id,
          });
          return this.friendshipRepository.save(friendship);
        }),
      );

      // Seed Group Messages
      await Promise.all(
        groupMessages.map(async (messageData, index) => {
          const message = this.groupMessageRepository.create({
            ...messageData,
            sender: createdUsers[index % createdUsers.length],
            senderId: createdUsers[index % createdUsers.length].id,
            group: createdGroups[index % createdGroups.length],
            groupId: createdGroups[index % createdGroups.length].id,
          });
          return this.groupMessageRepository.save(message);
        }),
      );

      console.log('Seeding completed successfully');
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  }
}
