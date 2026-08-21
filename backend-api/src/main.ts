import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Documentation Swagger
  const config = new DocumentBuilder()
    .setTitle('CEZAT API - Plateforme Pèlerins & Érudits')
    .setDescription('API Backend pour le Chatbot RAG certifié, Paiement PayDunya Sandbox et Back-Office Érudits')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Backend API CEZAT démarré avec succès sur http://localhost:${port}`);
  logger.log(`Documentation Swagger disponible sur http://localhost:${port}/api/docs`);
}
bootstrap();
