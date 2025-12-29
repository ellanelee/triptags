import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '@triptags/shared/src/dtos/auth/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() reisterDto: RegisterDto): Promise<void> {
    await this.authService.userRegister(reisterDto);
  }
}
