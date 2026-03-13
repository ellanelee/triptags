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
  createResponse,
  ReviewCreateDto,
  ReviewCreateWithDetailDto,
  ReviewPaginationDto,
  ReviewUpdateDto,
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
    @Query() paginationDto: ReviewPaginationDto,
  ) {
    const response = await this.reviewService.findReviewByVenueId(
      venueId,
      paginationDto,
    );
    return createResponse(true, response);
  }

  //검색 조건에 따라 Venue검색
  // @Get()
  // async getReviewBySearch(@Query() paginationDto: VenuePaginationDto) {
  //   return await this.reviewService.findReviewByInput(paginationDto);
  // }

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

  //사용자의 review수정 (평가점수, 평가내용수정)
  @Patch(':reviewId')
  @UseGuards(JwtAccessGuard)
  async updateReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() reviewUpdateDto: ReviewUpdateDto,
  ) {
    const response = await this.reviewService.UpdateReview(
      reviewId,
      reviewUpdateDto,
    );
    return createResponse(true, response);
  }

  @Post(':reviewId/helpful')
  @UseGuards(JwtAccessGuard)
  async checkHelpful(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
  ) {
    const response = await this.reviewService.createHelpful(reviewId, user.id);
    return createResponse(true, response);
  }
}
