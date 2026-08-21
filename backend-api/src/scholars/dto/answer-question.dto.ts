import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AnswerQuestionDto {
  @ApiProperty({ example: 'La prière de Djanaza comporte 4 Takbirs...', description: 'Réponse officielle et certifiée rédigée par l\'érudit' })
  @IsString()
  @IsNotEmpty({ message: 'La réponse officielle est obligatoire' })
  officialAnswer: string;
}
