import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '771234567', description: 'Numéro de téléphone' })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  phone: string;

  @ApiProperty({ example: 'pass1234', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}
