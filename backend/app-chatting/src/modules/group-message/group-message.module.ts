import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessageService } from './group-message.service';
import { GroupMessageController } from './group-message.controller';
import { GroupMessage } from './entities/group-message.entity';
import { GroupMessageRepository } from './group-message.repository';
import { UsersModule } from 'src/modules/users/users.module';
import { GroupModule } from 'src/modules/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMessage]), UsersModule, GroupModule],
  controllers: [GroupMessageController],
  providers: [GroupMessageService, GroupMessageRepository],
  exports: [GroupMessageService],
})
export class GroupMessageModule {}
