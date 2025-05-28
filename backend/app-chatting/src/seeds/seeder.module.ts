import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '../modules/users/entities/user.entity';
import { Group } from '../modules/group/entities/group.entity';
import { Message } from '../modules/messages/entities/message.entity';
import { Friendship } from '../modules/friendship/entities/friendship.entity';
import { GroupMessage } from '../modules/group-message/entities/group-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, Message, Friendship, GroupMessage]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
