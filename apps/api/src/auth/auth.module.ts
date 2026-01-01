import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.moule';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, PrismaModule, RedisModule, ConfigModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
