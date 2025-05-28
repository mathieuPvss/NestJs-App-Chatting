import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { GroupService } from '../group/group.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { GroupMessage } from './entities/group-message.entity';
import { GroupMessageRepository } from './group-message.repository';

@Injectable()
export class GroupMessageService {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
  ) {}

  async createMessage(
    createMessageDto: CreateGroupMessageDto,
    senderId: string,
  ): Promise<GroupMessage> {
    const sender = await this.userService.findOne(senderId);
    const group = await this.groupService.findGroupById(
      createMessageDto.groupId,
      senderId,
    );

    return this.groupMessageRepository.createMessage(
      createMessageDto.content,
      sender,
      group,
    );
  }

  async findMessagesByGroup(
    groupId: string,
    userId: string,
  ): Promise<GroupMessage[]> {
    const group = await this.groupService.findGroupById(groupId, userId);
    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }
    return this.groupMessageRepository.findMessagesByGroup(groupId);
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message =
      await this.groupMessageRepository.findMessageById(messageId);
    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce message');
    }

    await this.groupMessageRepository.deleteMessage(messageId);
  }

  async deleteMessagesByGroup(groupId: string): Promise<void> {
    await this.groupMessageRepository.deleteMessagesByGroup(groupId);
  }
}
