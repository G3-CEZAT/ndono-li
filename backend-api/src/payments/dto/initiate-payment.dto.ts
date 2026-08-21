import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SubscriptionPlan {
  MONTHLY_500 = 'MONTHLY_500',
  ANNUAL_5000 = 'ANNUAL_5000',
}

export class InitiatePaymentDto {
  @ApiPropertyOptional({ enum: SubscriptionPlan, default: SubscriptionPlan.MONTHLY_500, description: 'Formule d\'abonnement choisie' })
  @IsEnum(SubscriptionPlan)
  @IsOptional()
  plan?: SubscriptionPlan;

  @ApiPropertyOptional({ example: 500, description: 'Montant en FCFA (par défaut 500 FCFA pour 30 jours)' })
  @IsNumber()
  @IsOptional()
  customAmount?: number;
}
