import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';




async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const uploadPath = join(__dirname, '..', 'uploads');

  app.useStaticAssets(uploadPath, {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
