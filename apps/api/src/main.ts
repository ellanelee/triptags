import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'debug'] });

  const config = new DocumentBuilder()
    .setTitle('Triptags API')
    .setDescription('Triptags Backend API Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // await app.init();

  //쿠키_경로_cors설정
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //DTO미포함 제거
      forbidNonWhitelisted: true, //DTO미정의 속성포함, 요청거부
      transform: true, // 수신된 데이터를 DTO Type으로 자동변환
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log('API Server Running!');
  console.log('swagger paths:', Object.keys(document.paths || {}).length);
}
bootstrap();
