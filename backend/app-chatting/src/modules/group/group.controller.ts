import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Group } from './entities/group.entity';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Créer un nouveau groupe' })
  @ApiResponse({
    status: 201,
    description: 'Le groupe a été créé avec succès',
    type: Group,
  })
  async create(@Body() dto: CreateGroupDto): Promise<Group> {
    return this.groupService.createGroup(dto);
  }

  @Get('/get/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Récupérer un groupe par son ID' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  async findById(@Param('id') id: string, @Request() req): Promise<Group> {
    return this.groupService.findGroupById(id, req.user.userId);
  }

  @Get('user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Récupérer les groupes d’un utilisateur' })
  async findGroupsByUser(@Request() req): Promise<Group[]> {
    return this.groupService.findGroupsByUser(req.user.userId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Supprimer un groupe (propriétaire uniquement)' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  async deleteGroup(
    @Param('id') groupId: string,
    @Request() req,
  ): Promise<void> {
    return this.groupService.deleteGroup(groupId, req.user.userId);
  }

  @Patch(':id/add/:userId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Ajouter un membre à un groupe' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur à ajouter" })
  async addMember(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ): Promise<Group> {
    return this.groupService.addMember(groupId, userId);
  }

  @Patch(':id/remove/:userId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retirer un membre du groupe' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur à retirer",
  })
  async removeMember(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ): Promise<Group> {
    return this.groupService.removeMember(groupId, userId);
  }

  @Patch(':id/leave')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Quitter un groupe' })
  @ApiParam({ name: 'id', description: 'ID du groupe' })
  async leaveGroup(
    @Param('id') groupId: string,
    @Request() req,
  ): Promise<void> {
    this.groupService.removeMember(groupId, req.user.userId);
    return;
  }
}
