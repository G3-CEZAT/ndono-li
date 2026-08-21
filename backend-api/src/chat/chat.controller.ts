import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@ApiTags('Chat & Enseignements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Liste de toutes les discussions de l\'utilisateur' })
  @Get('conversations')
  async getConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @ApiOperation({ summary: 'Créer une nouvelle session de discussion' })
  @Post('conversations')
  async createConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(userId, dto);
  }

  @ApiOperation({ summary: 'Récupérer l\'historique complet d\'une discussion' })
  @Get('conversations/:id')
  async getConversationMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.getConversationMessages(userId, conversationId);
  }

  @ApiOperation({ summary: 'Envoyer une question au Chatbot RAG (Wolof ou Français)' })
  @ApiResponse({ status: 200, description: 'Réponse certifiée du RAG avec citations et historique mis à jour' })
  @Post('message')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(userId, dto);
  }

  @ApiOperation({ summary: 'Envoyer une note vocale au Chatbot RAG (Wolof ou Français)' })
  @ApiResponse({ status: 200, description: 'Transcription automatique + Réponse certifiée RAG' })
  @Post('message-voice')
  @UseInterceptors(FileInterceptor('file'))
  async sendVoiceMessage(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('conversationId') conversationId?: string,
    @Body('languagePreference') languagePreference?: string,
  ) {
    return this.chatService.sendVoiceMessage(
      userId,
      file.buffer,
      file.originalname,
      file.mimetype,
      conversationId,
      languagePreference,
    );
  }

  @ApiOperation({ summary: 'Supprimer une discussion' })
  @Delete('conversations/:id')
  async deleteConversation(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.deleteConversation(userId, conversationId);
  }
}
