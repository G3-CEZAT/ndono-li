import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto, SubscriptionPlan } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly masterKey: string;
  private readonly privateKey: string;
  private readonly token: string;
  private readonly mode: string;
  private readonly baseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.masterKey = this.configService.get<string>('PAYDUNYA_MASTER_KEY') || 'test_master_key';
    this.privateKey = this.configService.get<string>('PAYDUNYA_PRIVATE_KEY') || 'test_private_key';
    this.token = this.configService.get<string>('PAYDUNYA_TOKEN') || 'test_token';
    this.mode = this.configService.get<string>('PAYDUNYA_MODE') || 'test';

    this.baseUrl = this.mode === 'live'
      ? 'https://app.paydunya.com/api/v1'
      : 'https://app.paydunya.com/sandbox-api/v1';
  }

  async initiateSubscription(userId: string, dto: InitiatePaymentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    let amount = 500;
    let durationDays = 30;
    let description = 'Abonnement mensuel CEZAT - Accès Chatbot Érudits (500 FCFA)';

    if (dto.plan === SubscriptionPlan.ANNUAL_5000) {
      amount = 5000;
      durationDays = 365;
      description = 'Abonnement annuel CEZAT - Accès Chatbot Érudits (5 000 FCFA)';
    }

    try {
      const payload = {
        invoice: {
          total_amount: amount,
          description,
        },
        store: {
          name: 'CEZAT Enseignements Érudits',
          tagline: 'Authenticité religieuse et spirituelle',
        },
        custom_data: {
          userId: user.id,
          phone: user.phone,
          durationDays,
        },
        actions: {
          cancel_url: 'https://cezat.app/payment/cancel',
          return_url: 'https://cezat.app/payment/success',
          callback_url: `${this.configService.get<string>('API_PUBLIC_URL', 'http://localhost:3000')}/payments/webhook/ipn`,
        },
      };

      const headers = {
        'PAYDUNYA-MASTER-KEY': this.masterKey,
        'PAYDUNYA-PRIVATE-KEY': this.privateKey,
        'PAYDUNYA-TOKEN': this.token,
        'Content-Type': 'application/json',
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/checkout-invoice/create`, payload, { headers }),
      );

      if (response.data?.response_code !== '00') {
        throw new BadRequestException(
          `Erreur lors de l'initialisation PayDunya: ${response.data?.response_text || 'Erreur inconnue'}`,
        );
      }

      const paydunyaToken = response.data.token;
      const invoiceUrl = response.data.response_text; // URL de paiement PayDunya

      // Enregistrement de la transaction en attente dans notre base
      const payment = await this.prisma.payment.create({
        data: {
          userId: user.id,
          paydunyaToken,
          amount,
          durationDays,
          status: 'PENDING',
          invoiceUrl,
        },
      });

      return {
        message: 'Facture de paiement générée avec succès',
        invoiceUrl,
        paydunyaToken,
        amount,
        durationDays,
      };
    } catch (error) {
      this.logger.error(`Erreur d'appel PayDunya: ${error.message}`, error.response?.data);
      throw new BadRequestException("Impossible d'initialiser le paiement PayDunya. Veuillez réessayer.");
    }
  }

  async handlePayDunyaIpn(data: any) {
    this.logger.log(`IPN PayDunya reçu: ${JSON.stringify(data)}`);

    const invoiceToken = data?.data?.invoice?.token || data?.token;
    if (!invoiceToken) {
      throw new BadRequestException('Token de facture manquant dans le Webhook IPN');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { paydunyaToken: invoiceToken },
      include: { user: true },
    });

    if (!payment) {
      this.logger.warn(`Paiement introuvable pour le token: ${invoiceToken}`);
      return { success: false, message: 'Transaction non trouvée' };
    }

    // Idempotence : si déjà complété, on ne retraite pas
    if (payment.status === 'COMPLETED') {
      return { success: true, message: 'Transaction déjà traitée' };
    }

    const status = data?.data?.status || data?.status;

    if (status === 'completed') {
      const durationDays = payment.durationDays || 30;
      const currentExpiry = payment.user.subscriptionExpiresAt;
      const now = new Date();

      // Si l'abonnement actuel est encore actif, on prolonge à partir de la date d'expiration
      const baseDate = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
      const newExpiry = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

      // Mise à jour de la transaction et de l'abonnement de l'utilisateur
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            receiptUrl: data?.data?.receipt_url || null,
          },
        }),
        this.prisma.user.update({
          where: { id: payment.userId },
          data: {
            subscriptionExpiresAt: newExpiry,
          },
        }),
      ]);

      this.logger.log(`Abonnement activé pour l'utilisateur ${payment.userId} jusqu'au ${newExpiry.toISOString()}`);
    } else if (status === 'failed' || status === 'cancelled') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: status.toUpperCase() },
      });
    }

    return { success: true, message: 'IPN traité avec succès' };
  }

  async getUserPaymentHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
