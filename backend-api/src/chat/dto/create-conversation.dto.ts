import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiPropertyOptional({ example: 'Questions sur la prière en voyage', description: 'Titre optionnel de la discussion' })
  @IsString()
  @IsOptional()
  title?: string;
}
