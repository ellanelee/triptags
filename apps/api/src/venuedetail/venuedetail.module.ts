import { Module } from '@nestjs/common';
import { VenueDetailController } from './venuedetail.controller';
import { VenueDetailService } from './venuedetail.service';
import { VenueModule } from '@/venue/venue.module';

@Module({
  imports: [VenueModule],
  controllers: [VenueDetailController],
  providers: [VenueDetailService],
  exports: [VenueDetailService],
})
export class VenueDetailModule {}
