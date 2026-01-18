import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VenueService } from './venue.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessStrategy } from '@/auth/strategy/jwt.access.strategy';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User, Venue } from '@prisma/client';
import { VenueCreateDto } from '@triptags/shared';

@ApiBearerAuth('access-token')
@ApiTags('users')
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
  @UseGuards(JwtAccessStrategy)
  async createVenue(
    @CurrentUser() user: User,
    @Body() venueCreateDto: VenueCreateDto,
  ) {
    return await this.venueService.createVenue(user.id, venueCreateDto);
  }
}
