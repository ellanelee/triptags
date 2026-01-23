import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';
import { VenuePaginationDto } from '@triptags/shared';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  async getReviewByVenueId(
    @Param() venueId: string,
    paginationDto: VenuePaginationDto,
  ) {
    return await this.reviewService.findReviewByVenueId(venueId, paginationDto);
  }
}
