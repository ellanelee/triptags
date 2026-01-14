import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, PrismaClient } from '@triptags/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient = prisma;
  async onModuleInit() {
    {
      await this.client.$connect();
      console.log('Data베이스 연결');
    }
  }
  async onModuleDestroy() {
    await this.client.$disconnect();
    console.log('Data베이스 연결해지');
  }
}
