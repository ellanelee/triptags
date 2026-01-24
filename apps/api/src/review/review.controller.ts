import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewCreateDto, VenuePaginationDto } from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('reviews')
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

  @Post(':venueId')
  @UseGuards(JwtAccessGuard)
  async createReview(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() reviewCreateDto: ReviewCreateDto,
  ) {
    return await this.reviewService.createReview(
      venueId,
      user.id,
      reviewCreateDto,
    );
  }
}
