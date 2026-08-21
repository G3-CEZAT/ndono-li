import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiClientService } from '../ai-client/ai-client.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class ScholarsService {
  private readonly logger = new Logger(ScholarsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiClient: AiClientService,
  ) {}

  async createDocument(scholarId: string, dto: CreateDocumentDto) {
    const document = await this.prisma.document.create({
      data: {
        title: dto.title,
        authorScholar: dto.authorScholar,
        category: dto.category || null,
        type: dto.type || 'TEXT',
        content: dto.content,
        fileUrl: dto.fileUrl || null,
        isPublished: dto.publishImmediately || false,
        createdById: scholarId,
      },
    });

    if (dto.publishImmediately) {
      await this.indexDocumentInRag(document);
    }

    return document;
  }

  async getDocuments() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });
  }

  async publishDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document introuvable');
    }

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: { isPublished: true },
    });

    await this.indexDocumentInRag(updated);

    return {
      message: 'Document validé et indexé avec succès dans le RAG IA',
      document: updated,
    };
  }

  async getUnansweredQuestions() {
    return this.prisma.unansweredQuestion.findMany({
      where: { status: 'PENDING' },
      orderBy: [
        { frequencyCount: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async answerQuestion(scholarId: string, questionId: string, dto: AnswerQuestionDto) {
    const question = await this.prisma.unansweredQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question introuvable');
    }

    const updatedQuestion = await this.prisma.unansweredQuestion.update({
      where: { id: questionId },
      data: {
        officialAnswer: dto.officialAnswer,
        answeredById: scholarId,
        status: 'ANSWERED',
      },
      include: {
        answeredBy: {
          select: { fullName: true, phone: true },
        },
      },
    });

    // Boucle d'apprentissage continu : Indexer immédiatement cette nouvelle réponse certifiée dans le RAG
    try {
      const scholarName = updatedQuestion.answeredBy?.fullName || 'Comité Scientifique des Érudits';
      await this.aiClient.ingestDocument({
        documentId: `qa-${question.id}`,
        title: `Question-Réponse Certifiée: ${question.rawQuestion.slice(0, 50)}`,
        authorScholar: scholarName,
        content: `Question des fidèles: ${question.rawQuestion}\nRéponse certifiée de l'érudit (${scholarName}): ${dto.officialAnswer}`,
        type: 'TEXT',
      });
      this.logger.log(`Réponse de l'érudit indexée avec succès dans le RAG pour la question: "${question.rawQuestion}"`);
    } catch (err) {
      this.logger.error(`Erreur d'indexation automatique de la réponse certifiée: ${err.message}`);
    }

    return {
      message: 'Réponse enregistrée, certifiée et indexée dans l\'IA',
      question: updatedQuestion,
    };
  }

  async discardQuestion(questionId: string) {
    const question = await this.prisma.unansweredQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question introuvable');
    }

    return this.prisma.unansweredQuestion.update({
      where: { id: questionId },
      data: { status: 'DISCARDED' },
    });
  }

  private async indexDocumentInRag(document: any) {
    try {
      await this.aiClient.ingestDocument({
        documentId: document.id,
        title: document.title,
        authorScholar: document.authorScholar,
        content: document.content,
        type: document.type,
      });
    } catch (error) {
      this.logger.error(`Échec de l'indexation RAG pour le document ${document.id}: ${error.message}`);
    }
  }
}
