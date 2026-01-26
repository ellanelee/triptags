import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { UserPointService } from './userpoint.service';

@Module({
  imports: [PrismaService],
  providers: [UserPointService],
  exports: [UserPointService],
})
export class UserPointModule {}
