import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import {
  VenueCreateDto,
  VenueUpdateDto,
  VenueUpdateDtoUser,
} from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';

@ApiBearerAuth('access-token')
@ApiTags('venues')
@Controller('venues')
export class VenueController {
  constructor(private venueService: VenueService) {}

  @Get()
  async getAllVenues() {
    return await this.venueService.findAll();
  }

  @Get()
  async getVenueById(venueId: string) {
    return await this.venueService.findVenueById(venueId);
  }

  @Post()
  @UseGuards(JwtAccessGuard)
  async createVenue(
    @CurrentUser() user: User,
    @Body() venueCreateDto: VenueCreateDto,
  ) {
    console.log(user);
    return await this.venueService.createVenue(user.id, venueCreateDto);
  }

  //사용자의 venue수정 (언어별 이름/이미지 추가가능)
  @Patch(':id/user')
  @UseGuards(JwtAccessGuard)
  async updateVenueByUser(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
    @Body() venueUpdateDtoUser: VenueUpdateDtoUser,
  ) {
    console.log(user);
    return await this.venueService.updateVenueByUser(
      user.id,
      venueId,
      venueUpdateDtoUser,
    );
  }

  //관리자의 venue수정 (모든 필드 수정가능)
  @Patch(':id/admin')
  @UseGuards(JwtAccessGuard)
  async updateVenue(
    @CurrentUser() user: User,
    @Body() venueUpdateDto: VenueUpdateDto,
  ) {
    console.log(user);
    return await this.venueService.updateVenueByUser(user.id, venueUpdateDto);
  }
}
