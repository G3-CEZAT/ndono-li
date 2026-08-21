import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Guide des Rituels et Prières du Pèlerin', description: 'Titre de l\'ouvrage ou de l\'enseignement' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  title: string;

  @ApiProperty({ example: 'Cheikh Ahmadou Bamba / El Hadji Malick Sy / Comité des Érudits', description: 'Auteur ou Érudit référent' })
  @IsString()
  @IsNotEmpty({ message: 'L\'auteur ou érudit est obligatoire' })
  authorScholar: string;

  @ApiPropertyOptional({ example: 'Fiqh / Prière / Pèlerinage', description: 'Catégorie thématique' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'TEXT', default: 'TEXT', description: 'Type de document (TEXT, PDF, AUDIO_TRANSCRIPT)' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'Texte complet validé de l\'enseignement religieux...', description: 'Contenu textuel vérifié' })
  @IsString()
  @IsNotEmpty({ message: 'Le contenu du document est obligatoire' })
  content: string;

  @ApiPropertyOptional({ example: 'https://storage.cezat.app/docs/guide.pdf', description: 'URL du fichier source original' })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional({ example: true, default: false, description: 'Indexer immédiatement dans la base vectorielle RAG' })
  @IsOptional()
  publishImmediately?: boolean;
}
