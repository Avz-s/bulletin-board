import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  mkdirSync(join(process.cwd(), 'data', 'uploads'), { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // app.enableCors();

  app.enableCors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200',
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'data', 'uploads'), { prefix: '/uploads' });


  
  await app.listen(process.env.PORT ?? 3000);
}



bootstrap();
