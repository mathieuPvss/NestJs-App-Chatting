import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { Friendship } from './modules/friendship/entities/friendship.entity';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { GroupMessage } from './modules/group-message/entities/group-message.entity';
import { GroupMessageModule } from './modules/group-message/group-message.module';
import { Group } from './modules/group/entities/group.entity';
import { GroupModule } from './modules/group/group.module';
import { Message } from './modules/messages/entities/message.entity';
import { MessagesModule } from './modules/messages/messages.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ChatModule } from './modules/chat/chat.module';
import { SeederModule } from './seeds/seeder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Message, GroupMessage, Group, Friendship],
      synchronize: true,
    }),
    UsersModule,
    MessagesModule,
    FriendshipModule,
    GroupModule,
    GroupMessageModule,
    AuthModule,
    ChatModule,
    SeederModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
