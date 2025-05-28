import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: "email d'utilisateur",
    example: 'john_doe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
  })
  @IsString()
  @MinLength(3)
  password: string;

  @ApiProperty({
    description: "Nom d'utilisateur unique",
    example: 'john_doe',
  })
  @IsString()
  @Length(3, 20, {
    message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères.",
  })
  username: string;

  @ApiProperty({
    description: "Couleur de l'utilisateur",
    example: '#FF0000',
  })
  @IsString()
  color: string;
}
