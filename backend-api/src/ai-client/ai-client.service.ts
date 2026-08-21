import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

export interface RagResponse {
  answer: string;
  isFound: boolean;
  sources: Array<{
    documentTitle: string;
    authorScholar: string;
    score: number;
    chunkContent: string;
  }>;
  detectedLanguage: string;
  transcription?: string;
  unansweredLogged?: boolean;
}

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private readonly aiServiceUrl: string;
  private readonly internalSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8000';
    this.internalSecret = this.configService.get<string>('INTERNAL_AI_SECRET') || 'cezat_internal_ai_token_2026';
  }

  async askRag(
    question: string,
    history: Array<{ sender: string; content: string }> = [],
    languagePreference?: string,
  ): Promise<RagResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<RagResponse>(
          `${this.aiServiceUrl}/rag/ask`,
          {
            question,
            history,
            languagePreference,
          },
          {
            headers: {
              'X-Internal-Secret': this.internalSecret,
            },
            timeout: 90000,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de l'appel au microservice IA: ${error.message}`, error.stack);
      return {
        answer: "Le service des enseignements certifiés est momentanément indisponible. Veuillez réessayer dans un instant.",
        isFound: false,
        sources: [],
        detectedLanguage: 'fr',
      };
    }
  }

  async askRagVoice(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    history: Array<{ sender: string; content: string }> = [],
    languagePreference?: string,
  ): Promise<RagResponse> {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: mimeType,
      });

      if (history && history.length > 0) {
        formData.append('history', JSON.stringify(history));
      }
      if (languagePreference) {
        formData.append('languagePreference', languagePreference);
      }

      const response = await firstValueFrom(
        this.httpService.post<RagResponse>(
          `${this.aiServiceUrl}/rag/ask-voice`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'X-Internal-Secret': this.internalSecret,
            },
            timeout: 60000,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors du traitement de la note vocale: ${error.message}`, error.stack);
      return {
        answer: "Impossible de traiter la note vocale pour le moment. Veuillez réessayer.",
        isFound: false,
        sources: [],
        detectedLanguage: 'fr',
      };
    }
  }

  async ingestDocument(payload: {
    documentId: string;
    title: string;
    authorScholar: string;
    content: string;
    type: string;
  }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/ingest/document`,
          payload,
          {
            headers: {
              'X-Internal-Secret': this.internalSecret,
            },
            timeout: 60000,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de l'ingestion du document vers l'IA: ${error.message}`);
      throw error;
    }
  }

  async ingestAudio(
    documentId: string,
    title: string,
    authorScholar: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ) {
    try {
      const formData = new FormData();
      formData.append('documentId', documentId);
      formData.append('title', title);
      formData.append('authorScholar', authorScholar);
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: mimeType,
      });

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/ingest/audio`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'X-Internal-Secret': this.internalSecret,
            },
            timeout: 120000,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de l'ingestion audio vers l'IA: ${error.message}`);
      throw error;
    }
  }
}
