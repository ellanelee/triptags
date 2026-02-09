import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ReviewDetailCreateDto } from '@triptags/shared';
import { ReviewDetailService } from './reviewDetail.service';

@Controller('reviewDetail')
@ApiTags('reviewDetail')
@ApiBearerAuth('access-token')
export class ReviewDetailController {
  constructor(private reviewDetailService: ReviewDetailService) {}

  @Post(':reviewId')
  @UseGuards(JwtAccessGuard)
  async handleCreate(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() createDto: ReviewDetailCreateDto,
  ) {
    return await this.reviewDetailService.createReviewDetails(
      reviewId,
      createDto,
    );
  }
}
