import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { createResponse } from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewPaginationDto } from './dtos/reviewpagination.dto';
import { ReviewCreateWithDetailDto } from './dtos/reviewcreatewithdetail.dto';

@ApiBearerAuth('access-token')
@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  //Venue의 Review검색
  @Get('/venue/:venueId')
  async getReviewByVenueId(
    @Param('venueId') venueId: string,
    @Query() paginationDto: ReviewPaginationDto,
  ) {
    const response = await this.reviewService.findReviewByVenueId(
      venueId,
      paginationDto,
    );
    return createResponse(true, response);
  }

  //개별 Review검색
  @Get(':reviewId')
  async getReviewById(@Param('reviewId') reviewId: string) {
    const response = await this.reviewService.findReviewById(reviewId);
    return createResponse(true, response);
  }

  //특정 User의 Review검색
  @UseGuards(JwtAccessGuard)
  @Get()
  async getReviewByUser(@CurrentUser() user: User) {
    const reviews = await this.reviewService.getReviewByUserId(user.id);
    return createResponse(true, reviews);
  }

  //사용자 Review생성
  @Post(':venueId')
  @UseGuards(JwtAccessGuard)
  async createReview(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() reviewCreateDto: ReviewCreateWithDetailDto,
  ) {
    const targetVenue = await this.reviewService.createReview(
      venueId,
      user.id,
      reviewCreateDto,
    );
    return createResponse(true, targetVenue);
  }

  //Review수정 (Description 수정)
  @Patch(':reviewId')
  @UseGuards(JwtAccessGuard)
  async updateReviewByCreator(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() reviewUpdateDto: ReviewCreateWithDetailDto,
  ) {
    const response = await this.reviewService.UpdateReview(
      user.id,
      user.role,
      reviewId,
      reviewUpdateDto,
    );
    return createResponse(true, response);
  }

  //도움돼요 추천반영
  @Post('helpful/:reviewId')
  @UseGuards(JwtAccessGuard)
  async checkHelpful(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ) {
    const response = await this.reviewService.createHelpful(reviewId, user.id);
    return createResponse(true, response);
  }

  //Review삭제
  @Delete(':reviewId')
  @UseGuards(JwtAccessGuard)
  async deleteReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ): Promise<void> {
    await this.reviewService.deleteReview(user.id, reviewId);
  }
}
