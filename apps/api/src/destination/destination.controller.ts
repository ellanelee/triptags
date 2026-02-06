import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { DestinationCreateDto } from '@triptags/shared';

@ApiBearerAuth('access-token')
@Controller()
@ApiTags('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}

  //개인의 선호 여행지 검색
  @Get('my')
  @UseGuards(JwtAccessGuard)
  async handleSearchFavorite(@CurrentUser() user: User) {
    await this.destinationService.getDestination(user.id);
  }

  //국가 코드는 i18n iso사용, city/district검색 (사용자 선호 여행지 등록을 위해)
  @Post()
  @UseGuards(JwtAccessGuard)
  async handleCreateFavorite(
    @CurrentUser() user: User,
    @Body() destinationDto: DestinationCreateDto,
  ) {
    return this.destinationService.createDestination(user.id, destinationDto);
  }

  //선호여행지 제거
  @Delete()
  @UseGuards(JwtAccessGuard)
  async handleRemoveDestination(
    @CurrentUser() user: User,
    @Query() regionId: string,
  ) {
    return this.destinationService.deleteDestination(user.id, regionId);
  }
}
