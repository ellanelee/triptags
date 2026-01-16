import { Controller, Get } from '@nestjs/common';
import { VenueService } from './venue.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
}
