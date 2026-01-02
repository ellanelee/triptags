import {
  Controller,
  Get,
  HttpCode,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.guard';
import { CurrentUserId } from '@/common/decorator/current_user.decorator';
import { JwtSubInfo } from '@/common/type/types';
import { IUserResponse } from '@triptags/shared';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(204)
  async userProfie(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
  ): Promise<IUserResponse> {
    return await this.userService.findById(jwtUserInfo.sub);
  }

  //Local User에만 있는 기본 정보 Update
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(204)
  async updateLocalUserProfile(@CurrentUserId() jwtUserInfo: JwtSubInfo) {
    return await this.userService.localUserProfileLoginUser(jwtUserInfo.sub);
  }

  //전체 사용자의 세부 정보 Update
  @UseGuards(JwtAuthGuard)
  @Put('me')
  @HttpCode(204)
  async updateUserProfile(@CurrentUserId() jwtUserInfo: JwtSubInfo) {
    return await this.userService.updateLoginUser(jwtUserInfo.sub);
  }
}
