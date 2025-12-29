import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }

  async findByNickname(nickname: string) {
    return this.prisma.user.findFirst({
      where: {
        nickname,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }
}
