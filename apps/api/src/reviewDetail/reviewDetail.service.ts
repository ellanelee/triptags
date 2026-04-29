import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewDetailCreateDto } from './dtos/reviewdetailcreate.dto';

@Injectable()
export class ReviewDetailService {
  constructor(private prisma: PrismaService) {}

  async createReviewDetails(
    reviewId: string,
    createDto: ReviewDetailCreateDto,
  ) {
    const review = await this.prisma.client.review.findFirst({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Review를 찾을수 없습니다.');
    const visitDate = createDto.visitDate
      ? new Date(createDto.visitDate)
      : undefined;
    return await this.prisma.client.reviewDetail.upsert({
      where: { reviewId: reviewId },
      update: {
        tasteRating: createDto.tasteRating,
        serviceRating: createDto.serviceRating,
        priceRating: createDto.priceRating,
        visitDate: visitDate,
        visitPurpose: createDto.visitPurpose,
      },
      create: {
        tasteRating: createDto.tasteRating,
        serviceRating: createDto.serviceRating,
        priceRating: createDto.priceRating,
        visitDate: visitDate,
        visitPurpose: createDto.visitPurpose,
        reviewId: reviewId,
      },
    });
  }
}
