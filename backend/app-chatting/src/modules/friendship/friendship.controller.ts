import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { Friendship } from './entities/friendship.entity';
import { FriendshipService } from './friendship.service';

@ApiTags('Friendships')
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Envoyer une demande d’amitié' })
  @ApiResponse({
    status: 201,
    description: 'Demande envoyée',
    type: Friendship,
  })
  sendRequest(@Body() dto: CreateFriendshipDto) {
    return this.friendshipService.sendFriendRequest(dto);
  }

  @Get('received')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Voir les demandes reçues' })
  @ApiResponse({ status: 200, type: [Friendship] })
  getReceivedRequests(@Request() req) {
    return this.friendshipService.getReceivedFriendRequests(req.user.userId);
  }

  @Get('sent')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Voir les demandes envoyées' })
  @ApiResponse({ status: 200, type: [Friendship] })
  getSentRequests(@Request() req) {
    return this.friendshipService.getSentFriendRequests(req.user.userId);
  }

  @Put(':id/accept')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Accepter une demande d’amitié' })
  @ApiResponse({ status: 200, type: Friendship })
  accept(@Param('id') id: string, @Request() req) {
    return this.friendshipService.acceptFriendRequest(id, req.user.userId);
  }

  @Put(':id/reject')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Rejeter une demande d’amitié' })
  @ApiResponse({ status: 200, type: Friendship })
  reject(@Param('id') id: string, @Request() req) {
    return this.friendshipService.rejectFriendRequest(id, req.user.userId);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Liste de mes amis' })
  @ApiResponse({ status: 200, type: [Friendship] })
  getFriends(@Request() req) {
    return this.friendshipService.getAllFriends(req.user.userId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Supprimer une relation d’amitié' })
  @ApiResponse({ status: 200, description: 'Relation supprimée' })
  delete(@Param('id') id: string, @Request() req) {
    return this.friendshipService.removeFriend(id, req.user.userId);
  }
}
