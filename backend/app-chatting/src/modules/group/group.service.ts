import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { UsersService } from 'src/modules/users/users.service';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userService: UsersService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const owner = await this.userService.findOne(createGroupDto.ownerId);
    const members = await Promise.all(
      createGroupDto.memberIds.map((id) => this.userService.findOne(id)),
    );

    return this.groupRepository.createGroup(
      createGroupDto.name,
      owner,
      members,
    );
  }

  async findGroupById(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const isMember = group.members.some((member) => member.id === userId);
    if (!isMember) {
      throw new ForbiddenException('User is not a member of the group');
    }

    group.members.forEach((member) => {
      member.password = undefined;
    });
    return group;
  }

  async findGroupsByUser(userId: string): Promise<Group[]> {
    return this.groupRepository.findGroupsByUser(userId);
  }

  async addMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const user = await this.userService.findOne(userId);

    const alreadyMember = group.members.some((member) => member.id === user.id);
    if (alreadyMember) {
      throw new BadRequestException('User is already a member of the group');
    }

    return this.groupRepository.addMember(groupId, user);
  }

  async removeMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    if (group.ownerId === userId) {
      throw new ForbiddenException('Owner cannot be removed from the group');
    }

    const isMember = group.members.some((member) => member.id === userId);
    if (!isMember) {
      throw new BadRequestException('User is not a member of the group');
    }

    return this.groupRepository.removeMember(groupId, userId);
  }

  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete the group');
    }

    await this.groupRepository.deleteGroup(groupId);
  }
}
