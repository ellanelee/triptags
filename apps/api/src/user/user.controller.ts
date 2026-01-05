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
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '@/common/decorator/current_user.decorator';
import { JwtSubInfo } from '@/common/type/types';
import {
  IUserNickname,
  UpdatePasswordDto,
  IUserResponse,
  IUserUpdate,
  createResponse,
  ApiResponse,
} from '@triptags/shared';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAccessGuard)
  @Get('me')
  @HttpCode(200)
  async getUserProfie(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
  ): Promise<ApiResponse<IUserResponse>> {
    const userProfile = await this.userService.findAllById(jwtUserInfo.sub);
    return createResponse(true, userProfile, '회원 정보 검색완료');
  }

  //사용자 ID로 정보조회
  @UseGuards(JwtAccessGuard)
  @Get(':userId/profile')
  @HttpCode(200)
  async userPersonalInfo(
    @Param('userId') targetUserId: string,
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
  ) {
    const loggedInUser = await this.getUserProfie(jwtUserInfo);
    console.log('로그인된 유저정보 :', loggedInUser);
    let userPubicProfile;
    if (loggedInUser.data?.role === 'ADMIN') {
      userPubicProfile = await this.userService.findAllById(targetUserId);
    } else {
      userPubicProfile = await this.userService.findPubicInfoById(targetUserId);
    }
    return createResponse(true, userPubicProfile, '회원 정보 조회완료');
  }

  //User 정보 Update (nickname, password제외)
  @UseGuards(JwtAccessGuard)
  @Patch('me')
  @HttpCode(200)
  async updateLocalUserProfile(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Body() userUpdate: IUserUpdate,
  ): Promise<ApiResponse<IUserUpdate>> {
    const updatedUserProfile = await this.userService.updateLoginUser(
      jwtUserInfo.sub,
      userUpdate,
    );
    return createResponse(true, updatedUserProfile, '회원 정보 수정완료');
  }

  //nickname변경
  @UseGuards(JwtAccessGuard)
  @Patch('changeNickname')
  @HttpCode(200)
  async updateUserNickname(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Body() userNickname: IUserNickname,
  ) {
    const changeNickname = await this.userService.updateUserNickname(
      jwtUserInfo.sub,
      userNickname,
    );
    return createResponse(true, changeNickname, '닉네임 수정완료');
  }

  //로컬 사용자의 password변경
  @UseGuards(JwtAccessGuard)
  @Patch('changePassword')
  @HttpCode(204)
  async updateUserPassword(
    @CurrentUserId() jwtUserInfo: JwtSubInfo,
    @Body() passwordUpdate: UpdatePasswordDto,
  ) {
    return this.userService.updateUserPassword(jwtUserInfo.sub, passwordUpdate);
  }

  @UseGuards(JwtAccessGuard)
  @Post('withdraw')
  @HttpCode(204)
  async withdraw(@CurrentUserId() jwtUserInfo: JwtSubInfo) {
    return this.userService.softDeleteUser(jwtUserInfo.sub);
  }
}
