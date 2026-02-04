import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DestinationService {
  constructor(private prisma: PrismaService) {}
}
