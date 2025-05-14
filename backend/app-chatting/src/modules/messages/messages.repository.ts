import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
  ) {}

  async createMessage(
    content: string,
    sender: User,
    recipient: User,
  ): Promise<Message> {
    const message = this.repo.create({
      content,
      sender,
      senderId: sender.id,
      recipient,
      recipientId: recipient.id,
    });
    return this.repo.save(message);
  }

  async findMessagesBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Message[]> {
    return this.repo.find({
      where: [
        { senderId: userId1, recipientId: userId2 },
        { senderId: userId2, recipientId: userId1 },
      ],
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMessageById(messageId: string): Promise<Message | null> {
    return this.repo.findOne({
      where: { id: messageId },
      relations: ['sender', 'recipient'],
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.repo.delete(messageId);
  }
}
