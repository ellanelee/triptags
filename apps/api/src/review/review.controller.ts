import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  ReviewCreateDto,
  ReviewUpdateDto,
  VenuePaginationDto,
} from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get(':venueId')
  async getReviewByVenueId(
    @Param('venueId') venueId: string,
    @Query() paginationDto: VenuePaginationDto,
  ) {
    return await this.reviewService.findReviewByVenueId(venueId, paginationDto);
  }

  //사용자 Review생성
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

  //사용자의 review수정 (평가점수, 평가내용수정)
  @Patch(':reviewId')
  @UseGuards(JwtAccessGuard)
  async updateReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() reviewUpdateDto: ReviewUpdateDto,
  ) {
    return await this.reviewService.UpdateReview(reviewId, reviewUpdateDto);
  }

  @Post(':reviewId/helpful')
  @UseGuards(JwtAccessGuard)
  async checkHelpful(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.reviewService.createHelpful(reviewId, user.id);
  }
}
