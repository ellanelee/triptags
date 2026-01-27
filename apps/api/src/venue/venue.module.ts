import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { RegionModule } from '@/region/region.module';

@Module({
  imports: [RegionModule],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
