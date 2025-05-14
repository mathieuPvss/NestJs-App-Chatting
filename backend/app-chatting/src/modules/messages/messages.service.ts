import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { UsersService } from 'src/modules/users/users.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly userService: UsersService,
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

    return this.messagesRepository.findMessagesBetweenUsers(userId1, userId2);
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
