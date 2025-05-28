import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Message } from './entities/message.entity';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Créer un nouveau message' })
  @ApiResponse({
    status: 201,
    description: 'Le message a été créé avec succès',
    type: Message,
  })
  async create(
    @Body() dto: CreateMessageDto,
    @Request() req,
  ): Promise<Message> {
    return this.messagesService.createMessage(dto, req.user.userId);
  }

  @Get('conversation/:userId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Récupérer la conversation entre deux utilisateurs',
  })
  @ApiParam({ name: 'userId', description: "ID de l'autre utilisateur" })
  async findMessagesBetweenUsers(
    @Param('userId') userId: string,
    @Request() req,
  ): Promise<Message[]> {
    return this.messagesService.findMessagesBetweenUsers(
      req.user.userId,
      userId,
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
    return this.messagesService.deleteMessage(messageId, req.user.userId);
  }
}
