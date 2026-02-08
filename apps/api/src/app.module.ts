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
import { TagModule } from './tag/tag.module';
import { UserPointModule } from './userpoint/userpoint.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DestinationModule } from './destination/destination.module';
import { LocalVerificationModule } from './local/local.module';
import { VenueStatsModule } from './venuestats/venuestats.module';

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
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
    }),
    AuthModule,
    PrismaModule,
    VenueModule,
    VenueDetailModule,
    TagModule,
    UserModule,
    ReviewModule,
    RedisModule,
    RegionModule,
    UserPointModule,
    DestinationModule,
    LocalVerificationModule,
    VenueStatsModule,
  ],
})
export class AppModule {}
