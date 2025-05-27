import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('WsJwtAuthGuard');
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = client.handshake.auth.token;

      if (!token) {
        throw new WsException('Token non fourni');
      }

      const payload = this.jwtService.verify(token);
      // Ajouter l'utilisateur au client socket pour une utilisation ultérieure
      client.data.user = payload;

      return true;
    } catch (err) {
      throw new WsException('Token invalide');
    }
  }
}
