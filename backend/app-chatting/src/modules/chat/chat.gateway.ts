import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { GroupMessageService } from '../group-message/group-message.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { CreateGroupMessageDto } from '../group-message/dto/create-group-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // À modifier en production pour spécifier les origines autorisées
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private readonly messagesService: MessagesService,
    private readonly groupMessageService: GroupMessageService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Récupérer le token depuis le handshake
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      // L'utilisateur est déjà authentifié par le WsJwtAuthGuard
      const userId = client.data.user.userId;
      this.userSockets.set(userId, client.id);

      // Joindre une room personnelle pour l'utilisateur
      client.join(`user:${userId}`);

      console.log(`Client connecté: ${client.id}, User: ${userId}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Trouver et supprimer l'utilisateur associé à ce socket
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    console.log(`Client déconnecté: ${client.id}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('private_message')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    try {
      const userId = client.data.user.userId;
      const message = await this.messagesService.createMessage(data, userId);

      // Envoyer le message au destinataire
      const recipientSocketId = this.userSockets.get(data.recipientId);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('new_private_message', message);
      }

      // Envoyer une confirmation à l'expéditeur
      client.emit('private_message_sent', message);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('group_message')
  async handleGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateGroupMessageDto,
  ) {
    try {
      const userId = client.data.user.userId;
      const message = await this.groupMessageService.createMessage(
        data,
        userId,
      );

      // Envoyer le message à tous les membres du groupe
      this.server
        .to(`group:${data.groupId}`)
        .emit('new_group_message', message);

      // Envoyer une confirmation à l'expéditeur
      client.emit('group_message_sent', message);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('join_group')
  async handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    client.join(`group:${data.groupId}`);
    client.emit('joined_group', { groupId: data.groupId });
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leave_group')
  async handleLeaveGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    client.leave(`group:${data.groupId}`);
    client.emit('left_group', { groupId: data.groupId });
  }
}
