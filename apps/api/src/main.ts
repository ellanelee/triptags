import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Triptags API')
    .setDescription('Triptags Backend API Docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.init();

  //쿠키_경로_cors설정
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTION'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //DTO미포함 제거
      forbidNonWhitelisted: true, //DTO미정의 속성포함, 요청거부
      transform: true, // 수신된 데이터를 DTO Type으로 자동변환
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log('API Server Running!');
  console.log('swagger paths:', Object.keys(document.paths || {}).length);
}
bootstrap();
