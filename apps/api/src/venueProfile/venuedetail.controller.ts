import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { VenueDetailService } from './venuedetail.service';
import { VenueCreateDetailDto } from '@triptags/shared';

@Controller()
@ApiTags('venueDetail')
export class VenueDetailController {
  constructor(private venueDetailService: VenueDetailService) {}

  @Post(':venueId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('jwt-access')
  async createVenueDetails(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() venueCreateDto: VenueCreateDetailDto,
  ) {
    return await this.venueDetailService.createVenueDetail(
      user.id,
      venueId,
      venueCreateDto,
    );
  }
  @Get(':venueId')
  async getVenueDetails(@Param('venueId') venueId: string) {
    return await this.venueDetailService.getVenueDetailById(venueId);
  }
}
