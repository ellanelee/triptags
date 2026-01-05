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
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from './jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUserId } from '@/common/decorator/current_user.decorator';
import { JwtSubInfo } from '@/common/type/types';
import { Request, response, Response } from 'express';

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
  @HttpCode(204)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.userLogin(loginDto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1209600,
    });

    return createResponse(true, tokens.accessToken, '로그인 및 토큰 발행 완료');
  }

  //refresh, Cookie의 refresh Token검증 및 redis비교후 Issue
  @UseGuards(JwtAccessGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const incomingToken = req.cookies['refreshToken'] as string;
    const tokens = await this.authService.issueNewToken(
      jwtUserInfo.sub,
      incomingToken,
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1209600,
    });

    return createResponse(true, tokens.accessToken, '토큰 재발행완료');
  }

  //redis에 토큰 저장정보 및 브라우저의 토큰 삭제
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.revokeRefreshToken(jwtUserInfo.sub);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
