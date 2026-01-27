import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { VenueModule } from './venue/venue.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { RegionModule } from './region/region.module';
import { VenueDetailModule } from './venuedetail/venuedetail.module';
import { TagModule, VenueTagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    VenueDetailModule,
    TagModule,
    UserModule,
    ReviewModule,
    RedisModule,
    RegionModule,
  ],
})
export class AppModule {}
