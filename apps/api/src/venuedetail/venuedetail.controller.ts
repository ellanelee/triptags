import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { VenueDetailService } from './venuedetail.service';
import { createResponse} from '@triptags/shared';
import { VenueDetailDto } from './dtos/venuedetail.dto';

@Controller('venueDetail')
@ApiTags('venueDetail')
@ApiBearerAuth('access-token')
export class VenueDetailController {
  constructor(private venueDetailService: VenueDetailService) {}

  @Get(':venueId')
  async getVenueDetails(@Param('venueId') venueId: string) {
    const venueDetail =
      await this.venueDetailService.getVenueDetailById(venueId);
    return createResponse(true, venueDetail);
  }

  //VenueDetail(관리자와 Venue등록자만 등록/수정 가능)
  @Post(':venueId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessGuard)
  async createVenueDetails(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() venueDetailDto: VenueDetailDto,
  ) {
    const response = await this.venueDetailService.createVenueDetail(
      user,
      venueId,
      venueDetailDto,
    );
    return createResponse(true, response);
  }
}
