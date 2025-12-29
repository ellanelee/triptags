import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from '@../../../packages/shared/src/dtos/auth/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async userRegister(registerDto: RegisterDto): Promise<void> {
    const isEmailExist = await this.userService.findByEmail(registerDto.email);
    const isNickNameExist = await this.userService.findByNickname(
      registerDto.nickname,
    );
    if (isEmailExist) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }
    if (isNickNameExist) {
      throw new ConflictException('이미 사용중인 닉네임입니다.');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          nickname: registerDto.nickname,
          provider: 'LOCAL',
          language: registerDto.language,
        },
      });
    } catch (error) {
      console.log('사용자 생성 오류', error);
      throw new InternalServerErrorException('유저 생성 실패');
    }
  }
}
