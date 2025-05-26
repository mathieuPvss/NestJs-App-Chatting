import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorateur';
import { Role } from 'src/modules/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès.',
    type: User,
  })
  @ApiBearerAuth('access-token')
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs.',
    type: [User],
  })
  @ApiBearerAuth('access-token')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé.', type: User })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/searchbyusername')
  @ApiOperation({ summary: 'Rechercher un utilisateur par son username' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé.',
    type: User,
  })
  @ApiBearerAuth('access-token')
  async searchUserByUsername(@Query('query') query: string) {
    return await this.usersService.searchUser(query);
  }
}
