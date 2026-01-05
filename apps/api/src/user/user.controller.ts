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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '@/common/decorator/current_user.decorator';
import {
  UpdatePasswordDto,
  IUserResponse,
  IUserUpdate,
  createResponse,
  ApiResponse,
  IUserPublicResponse,
  UpdateNicknameDto,
} from '@triptags/shared';
import { User } from '@prisma/client';

@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAccessGuard)
  @Get('me')
  @HttpCode(200)
  async getUserProfie(
    @CurrentUserId() user: User,
  ): Promise<ApiResponse<IUserResponse>> {
    console.log('UserId: ', user.id);
    const userProfile = await this.userService.findAllById(user.id);
    return createResponse(true, userProfile, '회원 정보 검색완료');
  }

  //사용자 ID로 정보조회
  @UseGuards(JwtAccessGuard)
  @Get(':userId/profile')
  @HttpCode(200)
  async userPersonalInfo(
    @Param('userId') targetUserId: string,
    @CurrentUserId() user: User,
  ) {
    let userProfile: IUserResponse | IUserPublicResponse;
    console.log(`Params targetId: ${targetUserId}, Current User:${user.id}`);
    if (user.role === 'ADMIN') {
      userProfile = await this.userService.findAllById(targetUserId);
    } else {
      userProfile = await this.userService.findPubicInfoById(targetUserId);
    }
    return createResponse(true, userProfile, '회원 정보 조회완료');
  }

  //User 정보 Update (nickname, password제외)
  @UseGuards(JwtAccessGuard)
  @Patch('me')
  @HttpCode(200)
  async updateLocalUserProfile(
    @CurrentUserId() user: User,
    @Body() userUpdate: IUserUpdate,
  ): Promise<ApiResponse<IUserUpdate>> {
    const updatedUserProfile = await this.userService.updateLoginUser(
      user.id,
      userUpdate,
    );
    console.log(user.id);
    return createResponse(true, updatedUserProfile, '회원 정보 수정완료');
  }

  //nickname변경
  @UseGuards(JwtAccessGuard)
  @Patch('changeNickname')
  @HttpCode(200)
  async updateUserNickname(
    @CurrentUserId() user: User,
    @Body() updateNickname: UpdateNicknameDto,
  ) {
    const changeNickname = await this.userService.updateUserNickname(
      user.id,
      updateNickname,
    );
    return createResponse(true, changeNickname, '닉네임 수정완료');
  }

  //로컬 사용자의 password변경
  @UseGuards(JwtAccessGuard)
  @Patch('changePassword')
  @HttpCode(204)
  async updateUserPassword(
    @CurrentUserId() user: User,
    @Body() passwordUpdate: UpdatePasswordDto,
  ) {
    return this.userService.updateUserPassword(user.id, passwordUpdate);
  }

  @UseGuards(JwtAccessGuard)
  @Post('withdraw')
  @HttpCode(204)
  async withdraw(@CurrentUserId() user: User) {
    return this.userService.softDeleteUser(user.id);
  }
}
