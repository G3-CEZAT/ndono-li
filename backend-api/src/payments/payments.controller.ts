import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('Paiements & Abonnements (PayDunya Sandbox)')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Initier un abonnement PayDunya (Pass 500 FCFA / mois)' })
  @ApiResponse({ status: 201, description: 'Lien de redirection PayDunya généré' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async initiateSubscription(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiateSubscription(userId, dto);
  }

  @ApiOperation({ summary: 'Webhook IPN PayDunya (Appelé par PayDunya lors d\'un paiement réussi)' })
  @ApiResponse({ status: 200, description: 'Statut du paiement validé et abonnement activé' })
  @HttpCode(HttpStatus.OK)
  @Post('webhook/ipn')
  async handlePayDunyaIpn(@Body() ipnData: any) {
    return this.paymentsService.handlePayDunyaIpn(ipnData);
  }

  @ApiOperation({ summary: 'Historique des paiements de l\'utilisateur connecté' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getUserPaymentHistory(@CurrentUser('id') userId: string) {
    return this.paymentsService.getUserPaymentHistory(userId);
  }
}
