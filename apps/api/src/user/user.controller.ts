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
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import {
  IUserResponse,
  createResponse,
  IUserPublicResponse,
} from '@triptags/shared';
import { User } from '@prisma/client';
import { UpdateNicknameDto } from './dtos/nicknameupdate.dto';
import { UpdatePasswordDto } from './dtos/passwordupdate.dto';
import { UserProfileImageDto } from './dtos/userimageprofile.dto';
import { LanguageDto } from './dtos/language.dto';
import { UserAddressDto } from './dtos/useraddress.dto';
import { UserIntroductionDto } from './dtos/userintroduction.dto';

@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //로그인한 사용자 정보 받아오기
  @UseGuards(JwtAccessGuard)
  @Get('me')
  @HttpCode(200)
  async getMyInfo(@CurrentUser() user: User) {
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
    @CurrentUser() user: User,
  ) {
    let userProfile: IUserResponse | IUserPublicResponse;
    console.log(`Params targetId: ${targetUserId}, Current User:${user.id}`);
    if (user.role === 'ADMIN' || user.id === targetUserId) {
      userProfile = await this.userService.findAllById(targetUserId);
    } else {
      userProfile = await this.userService.findPubicInfoById(targetUserId);
    }
    return createResponse(true, userProfile, '회원 정보 조회완료');
  }

  //nickname변경
  @UseGuards(JwtAccessGuard)
  @Patch('changeNickname')
  @HttpCode(200)
  async updateUserNickname(
    @CurrentUser() user: User,
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
    @CurrentUser() user: User,
    @Body() passwordUpdate: UpdatePasswordDto,
  ) {
    return this.userService.updateUserPassword(user.id, passwordUpdate);
  }
  //User language Update
  @UseGuards(JwtAccessGuard)
  @Patch('language')
  @HttpCode(200)
  async updateUserLanguage(
    @CurrentUser() user: User,
    @Body() updateDto: LanguageDto,
  ) {
    const updatedLanguage = await this.userService.updateLanguage(
      user.id,
      updateDto.language,
    );
    console.log(user.id);
    return createResponse(true, updatedLanguage, '회원 정보 수정완료');
  }

  //User 정보 이미지 정보 Update
  @UseGuards(JwtAccessGuard)
  @Patch('profileImage')
  @HttpCode(200)
  async updateUserProfileImage(
    @CurrentUser() user: User,
    @Body() userImageUpdate: UserProfileImageDto,
  ) {
    const updatedUserProfile = await this.userService.updateUserProfileImage(
      user.id,
      userImageUpdate.profileImageUrl,
    );
    console.log(user.id);
    return createResponse(true, updatedUserProfile, '회원 정보 수정완료');
  }

  //User Introduction Update
  @UseGuards(JwtAccessGuard)
  @Patch('introduction')
  @HttpCode(200)
  async user(
    @CurrentUser() user: User,
    @Body() userIntroduction: UserIntroductionDto,
  ) {
    const updatedUserIntroduction =
      await this.userService.updateUserIntroduction(
        user.id,
        userIntroduction.introduction,
      );
    console.log(user.id);
    return createResponse(true, updatedUserIntroduction, '회원 정보 수정완료');
  }

  //사용자의 주소 update
  @UseGuards(JwtAccessGuard)
  @Post('address')
  @HttpCode(200)
  async userAddress(
    @CurrentUser() user: User,
    @Body() userAddress: UserAddressDto,
  ) {
    const updatedUserAddress = await this.userService.updateUserAddress(
      user.id,
      userAddress,
    );
    console.log(user.id);
    return createResponse(true, updatedUserAddress, '회원 정보 수정완료');
  }

  //사용자 탈퇴
  @UseGuards(JwtAccessGuard)
  @Post('withdraw')
  @HttpCode(204)
  async withdraw(@CurrentUser() user: User) {
    return this.userService.softDeleteUser(user.id);
  }
}
