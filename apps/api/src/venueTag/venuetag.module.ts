import { Module } from '@nestjs/common';
import { VenueModule } from '@/venue/venue.module';
import { VenueTagController } from './venuetag.controller';
import { venueTagService } from './venuetag.service';

@Module({
  imports: [VenueModule],
  controllers: [VenueTagController],
  providers: [venueTagService],
  exports: [venueTagService],
})
export class VenueTagModule {}
