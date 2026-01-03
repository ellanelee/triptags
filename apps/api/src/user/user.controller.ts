import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.guard';
import { CurrentUserId } from '@/common/decorator/current_user.decorator';
import { JwtSubInfo } from '@/common/type/types';
import {
  IUserNickname,
  UpdatePasswordDto,
  IUserPublicResponse,
  IUserResponse,
  IUserUpdate,
} from '@triptags/shared';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(204)
  async getUserProfie(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
  ): Promise<IUserResponse> {
    return await this.userService.findAllById(jwtUserInfo.sub);
  }

  //사용자 ID로 정보조회
  @UseGuards(JwtAuthGuard)
  @Get(':userId/profile')
  @HttpCode(204)
  async userPersonalInfo(
    @Param('userId') targetUserId: string,
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
  ): Promise<IUserPublicResponse> {
    const loggedInUser = await this.getUserProfie(jwtUserInfo);
    console.log('로그인된 유저정보 :', loggedInUser);
    if (loggedInUser.role === 'ADMIN') {
      return await this.userService.findAllById(targetUserId);
    } else {
      return await this.userService.findPubicInfoById(targetUserId);
    }
  }

  //User 정보 Update (nickname, password제외)
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(204)
  async updateLocalUserProfile(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Body() userUpdate: IUserUpdate,
  ) {
    return await this.userService.updateLoginUser(jwtUserInfo.sub, userUpdate);
  }

  //nickname변경
  @UseGuards(JwtAuthGuard)
  @Patch('changeNickname')
  @HttpCode(204)
  async updateUserNickname(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Body() userNickname: IUserNickname,
  ) {
    return this.userService.updateUserNickname(jwtUserInfo.sub, userNickname);
  }

  //로컬 사용자의 password변경
  @UseGuards(JwtAuthGuard)
  @Patch('changeNickname')
  @HttpCode(204)
  async updateUserPassword(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Body() passwordUpdate: UpdatePasswordDto,
  ) {
    return this.userService.updateUserPassword(jwtUserInfo.sub, passwordUpdate);
  }
}
