import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiClientService } from '../ai-client/ai-client.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiClient: AiClientService,
  ) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            content: true,
            createdAt: true,
            sender: true,
          },
        },
      },
    });
  }

  async createConversation(userId: string, dto?: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: dto?.title || 'Nouvelle discussion',
      },
    });
  }

  async getConversationMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Discussion introuvable');
    }

    return conversation;
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    // 1. Vérification du statut d'abonnement
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isSubscribed = user.subscriptionExpiresAt
      ? new Date(user.subscriptionExpiresAt) > new Date()
      : false;

    // Les Érudits et Admins sont exemptés de l'obligation d'abonnement
    const isExempt = user.role === Role.ERUDIT || user.role === Role.ADMIN;

    if (!isSubscribed && !isExempt) {
      // Vérifier si l'utilisateur a droit à une question d'essai gratuite (ex: 3 messages gratuits max)
      const userMessagesCount = await this.prisma.message.count({
        where: {
          conversation: { userId },
          sender: 'USER',
        },
      });

      if (userMessagesCount >= 3) {
        throw new ForbiddenException(
          'Votre abonnement à 500 FCFA/mois est requis pour continuer à échanger avec le chatbot certifié. Veuillez recharger votre pass.',
        );
      }
    }

    // 2. Récupérer ou créer la conversation
    let conversationId = dto.conversationId;
    let conversation;

    if (conversationId) {
      conversation = await this.prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });
      if (!conversation) {
        throw new NotFoundException('Discussion introuvable');
      }
    } else {
      // Générer un titre basé sur les premiers mots de la question
      const titleSnippet = dto.content.slice(0, 45) + (dto.content.length > 45 ? '...' : '');
      conversation = await this.prisma.conversation.create({
        data: {
          userId,
          title: titleSnippet,
        },
      });
      conversationId = conversation.id;
    }

    // 3. Enregistrer le message de l'utilisateur
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId,
        sender: 'USER',
        content: dto.content,
      },
    });

    // 4. Charger l'historique récent (6 derniers messages) pour le contexte
    const recentMessages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const formattedHistory = recentMessages.reverse().map((msg) => ({
      sender: msg.sender,
      content: msg.content,
    }));

    // 5. Interroger le microservice RAG
    const ragResult = await this.aiClient.askRag(
      dto.content,
      formattedHistory,
      dto.languagePreference,
    );

    // 6. Enregistrer la réponse de l'IA
    const aiMessage = await this.prisma.message.create({
      data: {
        conversationId,
        sender: 'AI',
        content: ragResult.answer,
        sources: ragResult.sources.length > 0 ? (ragResult.sources as any) : null,
      },
    });

    // 7. Si le RAG n'a pas trouvé de source certifiée, enregistrer dans les questions orphelines pour les Érudits
    if (!ragResult.isFound) {
      const existingQuestion = await this.prisma.unansweredQuestion.findFirst({
        where: {
          rawQuestion: dto.content.trim(),
          status: 'PENDING',
        },
      });

      if (existingQuestion) {
        await this.prisma.unansweredQuestion.update({
          where: { id: existingQuestion.id },
          data: { frequencyCount: { increment: 1 } },
        });
      } else {
        await this.prisma.unansweredQuestion.create({
          data: {
            rawQuestion: dto.content.trim(),
            language: ragResult.detectedLanguage || 'fr',
            status: 'PENDING',
          },
        });
      }
    }

    // 8. Mettre à jour l'horodatage de la conversation
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return {
      conversationId,
      userMessage,
      aiMessage,
    };
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Discussion introuvable');
    }

    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { message: 'Discussion supprimée avec succès' };
  }
}
