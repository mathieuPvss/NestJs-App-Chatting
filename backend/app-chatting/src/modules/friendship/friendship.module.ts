import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { FriendshipRepository } from './friendship.repository';
import { UsersModule } from '../users/users.module';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Message]), UsersModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, FriendshipRepository],
  exports: [FriendshipService],
})
export class FriendshipModule {}
