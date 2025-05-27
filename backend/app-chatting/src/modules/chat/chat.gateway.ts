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
import { JwtService } from '@nestjs/jwt';
import { GroupService } from '../group/group.service';

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
    private readonly jwtService: JwtService,
    private readonly groupService: GroupService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Récupérer le token depuis le handshake
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.decode(token) as { sub: string };
      if (!payload || !payload.sub) {
        client.disconnect();
        return;
      }
      const userId = payload.sub;
      this.userSockets.set(userId, client.id);

      // Joindre une room personnelle pour l'utilisateur
      client.join(`user:${userId}`);

      // Récupérer tous les groupes de l'utilisateur et les rejoindre
      const userGroups = await this.groupService.findGroupsByUser(userId);
      for (const group of userGroups) {
        client.join(`group:${group.id}`);
        console.log(`Utilisateur ${userId} a rejoint le groupe ${group.id}`);
      }

      console.log(`Client connecté: ${client.id}, User: ${userId}`);
    } catch (error) {
      console.log('handleConnection error', error);
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
      const userId = client.data.user.sub;
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
      const userId = client.data.user.sub;
      const message = await this.groupMessageService.createMessage(
        data,
        userId,
      );

      // Envoyer le message à tous les membres du groupe
      this.server
        .to(`group:${data.groupId}`)
        .emit('new_group_message', message);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
