import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScholarsService } from './scholars.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { CreateDocumentDto } from './dto/create-document.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@ApiTags('Espace Érudits & Communauté Scientifique')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ERUDIT, Role.ADMIN)
@Controller('scholars')
export class ScholarsController {
  constructor(private readonly scholarsService: ScholarsService) {}

  @ApiOperation({ summary: 'Ajouter un document ou un enseignement (Texte/PDF)' })
  @ApiResponse({ status: 201, description: 'Document enregistré' })
  @Post('documents')
  async createDocument(
    @CurrentUser('id') scholarId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.scholarsService.createDocument(scholarId, dto);
  }

  @ApiOperation({ summary: 'Lister tous les documents et statuts de publication' })
  @Get('documents')
  async getDocuments() {
    return this.scholarsService.getDocuments();
  }

  @ApiOperation({ summary: 'Valider et indexer un document dans la base vectorielle RAG' })
  @Patch('documents/:id/publish')
  async publishDocument(@Param('id') documentId: string) {
    return this.scholarsService.publishDocument(documentId);
  }

  @ApiOperation({ summary: 'Lister les questions sans réponse posées par les pèlerins' })
  @Get('questions/unanswered')
  async getUnansweredQuestions() {
    return this.scholarsService.getUnansweredQuestions();
  }

  @ApiOperation({ summary: 'Répondre officiellement à une question et l\'indexer dans l\'IA' })
  @Post('questions/:id/answer')
  async answerQuestion(
    @CurrentUser('id') scholarId: string,
    @Param('id') questionId: string,
    @Body() dto: AnswerQuestionDto,
  ) {
    return this.scholarsService.answerQuestion(scholarId, questionId, dto);
  }

  @ApiOperation({ summary: 'Rejeter une question orpheline non pertinente' })
  @Patch('questions/:id/discard')
  async discardQuestion(@Param('id') questionId: string) {
    return this.scholarsService.discardQuestion(questionId);
  }
}
