import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectRepository(Group)
    private readonly repo: Repository<Group>,
  ) {}

  async createGroup(
    name: string,
    owner: User,
    members: User[],
  ): Promise<Group> {
    const group = this.repo.create({
      name,
      owner,
      ownerId: owner.id,
      members: [owner, ...members],
    });
    return this.repo.save(group);
  }

  async findById(groupId: string): Promise<Group> {
    return this.repo.findOne({
      where: { id: groupId },
      relations: ['members'],
    });
  }

  async findGroupsByUser(userId: string): Promise<Group[]> {
    return this.repo.find({
      where: {
        members: {
          id: userId,
        },
      },
    });
  }

  async addMember(groupId: string, user: User): Promise<Group> {
    const group = await this.repo.findOne({
      where: { id: groupId },
      relations: ['members'],
    });

    if (!group) throw new Error('Group not found');

    group.members.push(user);
    return this.repo.save(group);
  }

  async removeMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.repo.findOne({
      where: { id: groupId },
      relations: ['members'],
    });

    if (!group) throw new Error('Group not found');

    group.members = group.members.filter((member) => member.id !== userId);
    return this.repo.save(group);
  }

  async deleteGroup(groupId: string): Promise<void> {
    await this.repo.delete(groupId);
  }
}
