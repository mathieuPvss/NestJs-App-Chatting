import {
  IsNotEmpty,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Nom du groupe',
    example: 'Groupe de projet DevOps',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "ID de l'utilisateur propriétaire du groupe",
    example: '0f1c4aa7-df10-4cb6-9451-e1ff65236125',
  })
  @IsUUID()
  ownerId: string;

  @ApiProperty({
    description:
      'Liste des IDs des membres à ajouter au groupe (hors propriétaire)',
    example: [
      'd90bcdab-5d32-4e4c-9328-1f2b839e2154',
      'c2f9e3a5-4f6d-4873-b66b-b4f9393e3486',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  memberIds: string[];
}
