import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as path from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { VenueModule } from './venue/venue.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { RedisModule } from './redis/redis.moule';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(__dirname, '../../../.env'),
        path.join(__dirname, '../../.env.local'),
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //ms단위
        limit: 10, //요청횟수
      },
    ]),
    AuthModule,
    PrismaModule,
    VenueModule,
    UserModule,
    ReviewModule,
    RedisModule,
  ],
})
export class AppModule {}
