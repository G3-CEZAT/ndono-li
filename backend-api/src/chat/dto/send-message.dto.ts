import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiPropertyOptional({ example: 'conv-uuid-123', description: 'ID de la conversation (optionnel, une nouvelle sera créée si absent)' })
  @IsString()
  @IsOptional()
  conversationId?: string;

  @ApiProperty({ example: 'Naka lagnouy dioulee djanaza ?', description: 'Texte du message du pèlerin (Wolof ou Français)' })
  @IsString()
  @IsNotEmpty({ message: 'Le message ne peut pas être vide' })
  content: string;

  @ApiPropertyOptional({ example: 'wo', description: 'Préférence de langue de réponse (fr ou wo)' })
  @IsString()
  @IsOptional()
  languagePreference?: string;
}
