import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  //국가 코드는 i18n iso사용, city/district검색 (사용자 선호 여행지 등록을 위해)
  @Get(':countryCode')
  async handleSearchRegion(
    @Query('code') code: string,
    @Query('parentId') parentId: string,
  ) {
    await this.destinationService.getDestination(code, parentId);
  }

  @Post()
  @UseGuards(JwtAccessGuard)
  async handleCreateDestination(
    @CurrentUser() user: User,
    @Body() destinationDto: DestinationCreateDto,
  ) {
    return this.destinationService.createDestination(user.id, destinationDto);
  }
}
