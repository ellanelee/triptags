import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPointService } from './userpoint.service';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { createResponse } from '@triptags/shared';

@ApiBearerAuth('access-token')
@ApiTags('userpoints')
@Controller('userpoints')
export class UserPointController {
  constructor(private userPointService: UserPointService) {}

  //로그인한 사용자 정보 받아오기
  @UseGuards(JwtAccessGuard)
  @Get()
  @HttpCode(200)
  async handleGetMyInfo(@CurrentUser() user: User) {
    const response = await this.userPointService.getUserPoints(user);
    return createResponse(true, response);
  }
}
