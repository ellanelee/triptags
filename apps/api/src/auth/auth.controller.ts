import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, createResponse, RegisterDto } from '@triptags/shared';
import { LoginDto } from '@triptags/shared';
import { ApiTags } from '@nestjs/swagger';

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
  async login(@Body() loginDto: LoginDto): Promise<void> {
    await this.authService.userLogin(loginDto);
  }
}
