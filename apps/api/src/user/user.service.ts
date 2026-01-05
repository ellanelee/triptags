import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  USER_PERSONAL_SELECT,
  USER_PUBLIC_SELECT,
  USER_UPDATE_SELECT,
} from '@/common/const/user.select';
import {
  UpdateNicknameDto,
  IUserUpdate,
  UpdatePasswordDto,
} from '@triptags/shared';
import * as bcrypt from 'bcryptjs';

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

  //검색한 사용자의 모든 정보를 반환
  async findAllById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: USER_PERSONAL_SELECT,
    });
    if (!user) throw new UnauthorizedException('사용자가 없습니다');
    return {
      ...user,
      isLocal: user.provider === 'LOCAL',
    };
  }
  //검색한 사용자의 모든 정보를 반환
  async findPubicInfoById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: USER_PUBLIC_SELECT,
    });
    if (!user) throw new UnauthorizedException('사용자가 없습니다');
    return user;
  }

  //로컬가입자(email가입자 여부확인)
  async isLocalUser(id: string) {
    const user = await this.findAllById(id);
    if (!user) throw new UnauthorizedException('사용자가 없습니다');
    if (!user.isLocal) return false;
    return true;
  }

  //로그인된 local 사용자 정보 수정_Local사용자
  async updateLoginUser(userId: string, userUpdate: IUserUpdate) {
    const { profileImage, profile } = userUpdate;
    return this.prisma.user.update({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        profileImage,
        profile: profile ? { update: { ...profile } } : undefined,
      },
      select: USER_UPDATE_SELECT,
    });
  }
  //로그인된 local 사용자의 nickname수정
  async updateUserNickname(userId: string, updateNickname: UpdateNicknameDto) {
    const userNicknameAvailable = await this.nicknameExist(
      updateNickname.nickname,
    );
    if (userNicknameAvailable)
      throw new ForbiddenException('이미 사용중인 nickname입니다');
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
    if (!user) throw new UnauthorizedException('사용자가 존재하지 않습니다');
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname: updateNickname.nickname,
      },
    });
  }

  async updateUserPassword(userId: string, passwordUpdate: UpdatePasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        password: true,
        provider: true,
      },
    });
    if (!user) throw new NotFoundException('사용자가 존재하지 않습니다');
    if (!user.password || user.provider !== 'LOCAL')
      throw new ForbiddenException(
        '패스워드 변경이 허용되지 않는 사용자입니다',
      );
    const isPasswordMatch = await bcrypt.compare(
      passwordUpdate.prevPassword,
      user.password,
    );
    if (!isPasswordMatch)
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');

    const hashedPassword = await bcrypt.hash(passwordUpdate.newPassword, 10);
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  //탈퇴
  async softDeleteUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
    if (!user) throw new NotFoundException('사용자를 찾을수 없습니다');
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
