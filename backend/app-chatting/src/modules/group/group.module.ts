import { Module, forwardRef } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './group.repository';
import { UsersModule } from '../users/users.module';
import { GroupMessageModule } from '../group-message/group-message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    UsersModule,
    forwardRef(() => GroupMessageModule),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports: [GroupService],
})
export class GroupModule {}
