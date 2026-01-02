import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { USER_PUBLIC_SELECT } from '@/common/const/user.select';
import { IUserResponse, Provider as SharedProvider } from '@triptags/shared';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //사용자 local email존재여부 확인
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
  //사용자 local nickname존재여부 확인
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
  //이메일로 사용자 검색
  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  //nickname으로 사용자 검색
  async findByNickname(nickname: string) {
    return this.prisma.user.findFirst({
      where: {
        nickname,
        deletedAt: null,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });
    if (!user) throw new UnauthorizedException('사용자가 없습니다');
    return {
      ...user,
      isLocal: user.provider === 'LOCAL',
    };
  }

  //로그인된 사용자 정보 수정 (전체)
  async updateLoginUser(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  //로그인된 local 사용자 정보 수정_Local사용자
  async updateLocalLoginUser(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }
}
