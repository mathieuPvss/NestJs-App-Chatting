import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMessage } from './entities/group-message.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Group } from 'src/modules/group/entities/group.entity';

@Injectable()
export class GroupMessageRepository {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly repo: Repository<GroupMessage>,
  ) {}

  async createMessage(
    content: string,
    sender: User,
    group: Group,
  ): Promise<GroupMessage> {
    const message = this.repo.create({
      content,
      sender,
      senderId: sender.id,
      group,
      groupId: group.id,
    });
    return this.repo.save(message);
  }

  async findMessagesByGroup(groupId: string): Promise<GroupMessage[]> {
    return this.repo.find({
      where: { groupId },
      relations: ['sender', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMessageById(messageId: string): Promise<GroupMessage | null> {
    return this.repo.findOne({
      where: { id: messageId },
      relations: ['sender', 'group'],
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.repo.delete(messageId);
  }
}
