import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { GroupMessageRepository } from './group-message.repository';
import { UsersService } from 'src/modules/users/users.service';
import { GroupService } from 'src/modules/group/group.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { GroupMessage } from './entities/group-message.entity';

@Injectable()
export class GroupMessageService {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly userService: UsersService,
    private readonly groupService: GroupService,
  ) {}

  async createMessage(
    createMessageDto: CreateGroupMessageDto,
    senderId: string,
  ): Promise<GroupMessage> {
    const sender = await this.userService.findOne(senderId);
    const group = await this.groupService.findGroupById(
      createMessageDto.groupId,
    );

    // Vérifier si l'utilisateur est membre du groupe
    const isMember = group.members.some((member) => member.id === senderId);
    if (!isMember) {
      throw new ForbiddenException("Vous n'êtes pas membre de ce groupe");
    }

    return this.groupMessageRepository.createMessage(
      createMessageDto.content,
      sender,
      group,
    );
  }

  async findMessagesByGroup(groupId: string): Promise<GroupMessage[]> {
    const group = await this.groupService.findGroupById(groupId);
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
}
