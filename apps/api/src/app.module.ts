import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(__dirname, '../../../.env.local'),
        path.join(__dirname, '../../.env'),
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //ms단위
        limit: 10, //요청횟수
      },
    ]),
  ],
})
export class AppModule {}
