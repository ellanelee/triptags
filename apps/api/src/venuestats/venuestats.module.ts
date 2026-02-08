import { Module } from '@nestjs/common';
import { VenueStatsService } from './venuestats.service';

@Module({
  providers: [VenueStatsService],
  exports: [VenueStatsService],
})
export class VenueStatsModule {}
