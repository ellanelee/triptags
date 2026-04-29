import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { createResponse} from '@triptags/shared';
import { DestinationCreateDto } from './dtos/destinationcreate.dto';

@ApiBearerAuth('access-token')
@Controller('destination')
@ApiTags('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}

  //개인의 선호 여행지 검색
  @Get('my')
  @UseGuards(JwtAccessGuard)
  async handleSearchFavorite(@CurrentUser() user: User) {
    const data = await this.destinationService.getDestination(user.id);
    return createResponse(true, data);
  }

  //destination에 대한 내용파악
  @Get('info')
  @UseGuards(JwtAccessGuard)
  async handleRegionInfo(@CurrentUser() user: User) {
    const data = await this.destinationService.getRegionInfo(user.id);
    return createResponse(true, data);
  }

  //국가 코드는 i18n iso, city/district검색 (사용자 선호 여행지 등록을 위해)
  @Post()
  @UseGuards(JwtAccessGuard)
  async handleCreateFavorite(
    @CurrentUser() user: User,
    @Body() destinationDto: DestinationCreateDto,
  ) {
    const data = await this.destinationService.createDestination(
      user.id,
      destinationDto,
    );
    return createResponse(true, data);
  }

  //선호여행지 제거
  @Delete(':destinaionId')
  @UseGuards(JwtAccessGuard)
  async handleRemoveDestination(
    @CurrentUser() user: User,
    @Param('destinaionId') destinationId: string,
  ) {
    await this.destinationService.deleteDestination(destinationId);
    return createResponse(true, null);
  }
}
