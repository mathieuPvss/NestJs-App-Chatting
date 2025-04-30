import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: "email d'utilisateur",
    example: 'john_do_update@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @Length(3, 20, {
    message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères.",
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Mot de passe',
    example: 'newPassword456',
  })
  @IsOptional()
  @IsString()
  @Length(4, 20, {
    message: 'Le mot de passe doit contenir entre 4 et 20 caractères.',
  })
  password?: string;
}
