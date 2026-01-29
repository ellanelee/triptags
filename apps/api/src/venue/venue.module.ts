import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { RegionModule } from '@/region/region.module';
import { UserPointModule } from '@/userpoint/userpoint.module';

@Module({
  imports: [RegionModule, UserPointModule],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
