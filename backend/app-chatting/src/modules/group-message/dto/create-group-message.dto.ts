import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGroupMessageDto {
  @ApiProperty({
    description: 'Contenu du message',
    example: 'Bonjour tout le monde !',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID du groupe dans lequel le message est envoyé',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}
