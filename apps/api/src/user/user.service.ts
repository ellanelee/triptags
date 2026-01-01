import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //사용자 email검색(local)
  async emailExist(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
    return !!user;
  }
  //사용자 nickname검색(local)
  async nicknameExist(nickname: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        nickname,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
    return !!user;
  }

  //이메일 검색(local)
  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }

  //nickname검색(local)
  async findByNickname(nickname: string) {
    return this.prisma.user.findFirst({
      where: {
        nickname,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }

  //사용자 ID 검색 (Local)
  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }

  //사용자 정보 수정 (전체)
  async updateLoginUser(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  //사용자 검색 (전체 사용자)
  async findLoginUser(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async localUserProfileLoginUser(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        provider: 'LOCAL',
        deletedAt: null,
      },
    });
  }
}
