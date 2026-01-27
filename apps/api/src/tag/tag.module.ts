import { Module } from '@nestjs/common';
import { VenueModule } from '@/venue/venue.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [VenueModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
