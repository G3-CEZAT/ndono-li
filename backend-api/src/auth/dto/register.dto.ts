import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRoleDto {
  PELERIN = 'PELERIN',
  ERUDIT = 'ERUDIT',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({ example: '771234567', description: 'Numéro de téléphone du pèlerin ou de l\'érudit' })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  phone: string;

  @ApiProperty({ example: 'pass1234', description: 'Mot de passe sécurisé (au moins 4 caractères)' })
  @IsString()
  @MinLength(4, { message: 'Le mot de passe doit contenir au moins 4 caractères' })
  password: string;

  @ApiPropertyOptional({ example: 'Moussa Diop', description: 'Nom complet du pèlerin ou de l\'érudit' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ enum: UserRoleDto, default: UserRoleDto.PELERIN, description: 'Rôle (PELERIN, ERUDIT, ADMIN)' })
  @IsEnum(UserRoleDto)
  @IsOptional()
  role?: UserRoleDto;
}
