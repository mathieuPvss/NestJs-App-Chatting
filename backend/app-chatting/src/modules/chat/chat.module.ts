import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { GroupMessageModule } from '../group-message/group-message.module';
import { AuthModule } from '../auth/auth.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [MessagesModule, GroupMessageModule, AuthModule, GroupModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
