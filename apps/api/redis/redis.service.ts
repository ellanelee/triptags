import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.client.on('connect', () => {
      console.log('redis연결됨');
    });

    this.client.on('error', () => {
      console.log('redis연결에 오류발생');
    });
  }
  onModuleDestroy() {
    this.client.disconnect();
  }

  async setRefreshToken(
    userId: string,
    token: string,
    ttl: number,
  ): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.client.set(key, token, 'EX', ttl);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    return this.client.get(key);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.client.del(key);
  }
}
