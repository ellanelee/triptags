import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/redis/redis.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  private async generateToken(userId: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRED_IN'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRED_IN'),
      },
    );

    await this.redisService.setRefreshToken(userId, refreshToken, 1209600);
    return { accessToken, refreshToken };
  }

  async userRegister(registerDto: RegisterDto): Promise<void> {
    const isEmailExist = await this.userService.emailExist(registerDto.email);
    const isNickNameExist = await this.userService.nicknameExist(
      registerDto.nickname,
    );
    console.log(isEmailExist, isNickNameExist, registerDto);
    if (isEmailExist) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }
    if (isNickNameExist) {
      throw new ConflictException('이미 사용중인 닉네임입니다.');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      await this.prisma.client.user.create({
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

  async userLogin(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('이메일이 존재하지 않습니다');
    if (!user.password || typeof user.password !== 'string')
      throw new UnauthorizedException('비밀번호가 존재하지 않습니다.');
    if (user.provider !== 'LOCAL')
      throw new UnauthorizedException(
        '이메일 계정으로 가입한 사용자만 이메일 로그인이 가능합니다.',
      );

    const checkCredentials = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!checkCredentials)
      throw new UnauthorizedException('비밀번호가 정확하지 않습니다');

    const userPublic = await this.userService.findPubicInfoById(user.id);
    const tokens = await this.generateToken(user.id);
    console.log(tokens);
    return {
      ...tokens,
      userPublic,
    };
  }

  async issueNewToken(userId: string, incomingToken: string) {
    const user = await this.userService.findAllById(userId);
    await this.vaidateRefreshToken(userId, incomingToken);
    if (!user) throw new NotFoundException('사용자를 찾을수 없습니다');
    const { accessToken, refreshToken } = await this.generateToken(userId);
    return { accessToken, refreshToken };
  }

  async vaidateRefreshToken(userId: string, incomingToken: string) {
    const savedToken = await this.redisService.getRefreshToken(userId);
    if (savedToken !== incomingToken) {
      await this.redisService.deleteRefreshToken(userId);
      throw new UnauthorizedException(
        '비정상적인 접근이 감지되어 재로그인이 필요합니다',
      );
    }
  }
  async revokeRefreshToken(userId: string) {
    await this.redisService.deleteRefreshToken(userId);
  }
}
