import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { GroupMessageService } from './group-message.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GroupMessage } from './entities/group-message.entity';

@ApiTags('Group Messages')
@Controller('group-messages')
export class GroupMessageController {
  constructor(private readonly groupMessageService: GroupMessageService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Créer un nouveau message dans un groupe' })
  @ApiResponse({
    status: 201,
    description: 'Le message a été créé avec succès',
    type: GroupMessage,
  })
  async create(
    @Body() dto: CreateGroupMessageDto,
    @Request() req,
  ): Promise<GroupMessage> {
    return this.groupMessageService.createMessage(dto, req.user.userId);
  }

  @Get('group/:groupId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Récupérer tous les messages d'un groupe" })
  @ApiParam({ name: 'groupId', description: 'ID du groupe' })
  async findMessagesByGroup(
    @Param('groupId') groupId: string,
    @Request() req,
  ): Promise<GroupMessage[]> {
    return this.groupMessageService.findMessagesByGroup(
      groupId,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Supprimer un message' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  async deleteMessage(
    @Param('id') messageId: string,
    @Request() req,
  ): Promise<void> {
    return this.groupMessageService.deleteMessage(messageId, req.user.userId);
  }
}
