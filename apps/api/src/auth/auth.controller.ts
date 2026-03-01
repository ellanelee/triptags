import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, createResponse, RegisterDto } from '@triptags/shared';
import { LoginDto } from '@triptags/shared';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from './jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@ApiBearerAuth('access-token')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() reisterDto: RegisterDto): Promise<ApiResponse<null>> {
    await this.authService.userRegister(reisterDto);
    return createResponse(true, null, '회원정보 생성완료');
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.userLogin(loginDto);
    const { refreshToken, accessToken, userPublic } = data;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1209600 * 1000,
    });

    return createResponse(
      true,
      { accessToken, user: userPublic },
      '로그인 및 토큰 발행 완료',
    );
  }

  //refresh, Cookie의 refresh Token검증 및 redis비교후 Issue
  @UseGuards(JwtAccessGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const incomingToken = req.cookies['refreshToken'] as string;
    const tokens = await this.authService.issueNewToken(user.id, incomingToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });

    return createResponse(true, tokens.accessToken, '토큰 재발행완료');
  }

  //redis에 토큰 저장정보 및 브라우저의 토큰 삭제
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.revokeRefreshToken(user.id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
