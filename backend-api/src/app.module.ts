import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AiClientModule } from './ai-client/ai-client.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { ScholarsModule } from './scholars/scholars.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AiClientModule,
    AuthModule,
    ChatModule,
    PaymentsModule,
    ScholarsModule,
  ],
})
export class AppModule {}
