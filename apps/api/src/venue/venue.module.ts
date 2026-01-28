import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { RegionModule } from '@/region/region.module';
import { UserPointService } from '@/userpoint/userpoint.service';

@Module({
  imports: [RegionModule, UserPointService],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
