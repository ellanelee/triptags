import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { VenuePaginationDto } from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';

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

  @Post()
  @UseGuards(JwtAccessGuard)
  async createReview() {}
}
