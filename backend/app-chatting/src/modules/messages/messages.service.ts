import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { UsersService } from 'src/modules/users/users.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { FriendshipService } from '../friendship/friendship.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly userService: UsersService,
    private readonly friendshipService: FriendshipService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
  ): Promise<Message> {
    const sender = await this.userService.findOne(senderId);
    const recipient = await this.userService.findOne(
      createMessageDto.recipientId,
    );

    if (!recipient) {
      throw new NotFoundException('Destinataire non trouvé');
    }

    const isFriend = await this.friendshipService.isFriend(
      senderId,
      createMessageDto.recipientId,
    );
    if (!isFriend) {
      throw new ForbiddenException("Vous n'êtes pas ami avec ce utilisateur");
    }
    return this.messagesRepository.createMessage(
      createMessageDto.content,
      sender,
      recipient,
    );
  }

  async findMessagesBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Message[]> {
    // Vérifier que les deux utilisateurs existent
    await this.userService.findOne(userId1);
    await this.userService.findOne(userId2);

    const isFriend = await this.friendshipService.isFriend(userId1, userId2);
    if (!isFriend) {
      throw new ForbiddenException("Vous n'êtes pas ami avec ce utilisateur");
    }

    const messages = await this.messagesRepository.findMessagesBetweenUsers(
      userId1,
      userId2,
    );
    messages.forEach((message) => {
      delete message.sender.password;
      delete message.recipient.password;
    });
    return messages;
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messagesRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce message');
    }

    await this.messagesRepository.deleteMessage(messageId);
  }
}
