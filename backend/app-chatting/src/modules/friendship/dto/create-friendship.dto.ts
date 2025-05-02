import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateFriendshipDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui envoie la demande d'amitié",
    example: 'uuid-1234-5678-9101',
  })
  @IsInt({ message: "L'identifiant du demandeur doit être un entier." })
  requesterId: string;

  @ApiProperty({
    description: "ID de l'utilisateur qui reçoit la demande d'amitié",
    example: 'uuid-1234-5678-9102',
  })
  @IsInt({ message: "L'identifiant du destinataire doit être un entier." })
  recipientId: string;
}
