import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Language } from '@triptags/shared';
import { IUserPoint } from '@/common/type/types';
import { PointType, Prisma } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReviewPaginationDto } from './dtos/reviewpagination.dto';
import { ReviewCreateWithDetailDto } from './dtos/reviewcreatewithdetail.dto';
import { ReviewUpdateDto } from './dtos/reviewupdate.dto';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private readonly event: EventEmitter2,
  ) {}

  //user의 review받아오기
  async getReviewByUserId(userId: string) {
    return await this.prisma.client.review.findMany({
      where: { userId: userId },
      select: {
        id: true,
        contents: true,
        rating: true,
        _count: {
          select: { reviewHelpfuls: true },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  //검색 조건에 의해 review받아오기
  //  async findReviewByInput(pageDto: VenuePaginationDto){
  //   return  return await this.prisma.client.review.findMany({

  //   })
  //  }

  //venue별 review 받아오기
  async findReviewByVenueId(venueId: string, pageDto: ReviewPaginationDto) {
    const page = Number(pageDto.page) || 1;
    const items = Number(pageDto.items) || 10;
    const searchFilter = pageDto.filter;
    const skip = (page - 1) * items;
    const where: Prisma.ReviewWhereInput = {
      venueId,
      deletedAt: null,
    };
    if (searchFilter === 'USER') {
      where.localVerificationId = null;
    }
    if (searchFilter === 'LOCAL') {
      where.localVerificationId = { not: null };
    }
    const [totalCount, data] = await Promise.all([
      this.prisma.client.review.count({
        where,
      }),
      this.prisma.client.review.findMany({
        where,
        skip,
        take: items,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      }),
    ]);
    return {
      items: data,
      meta: {
        totalCount,
        page,
        itemsPerPage: items,
        totalPage: Math.ceil(totalCount / items),
        hasNextPage: page < Math.ceil(totalCount / items),
        hasPrevPage: page > 1,
      },
    };
  }

  async createReview(
    venueId: string,
    userId: string,
    createDto: ReviewCreateWithDetailDto,
  ) {
    const targetVenue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
    });

    const targetUser = await this.prisma.client.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!targetVenue)
      throw new NotFoundException('Review를 등록할 장소를 찾을수 없습니다');
    if (!targetUser) throw new NotFoundException('사용자를 찾을수 없습니다');
    const review = await this.prisma.client.review.create({
      data: {
        rating: createDto.rating,
        contents: createDto.contents,
        authorRole: createDto.authorRole,
        localVerificationId: createDto.localVerificationId,
        venueId: venueId,
        userId: userId,
        reviewDetail: {
          create: {
            tasteRating: createDto.reviewDetail.tasteRating,
            serviceRating: createDto.reviewDetail.serviceRating,
            priceRating: createDto.reviewDetail.priceRating,
            visitPurpose: createDto.reviewDetail.visitPurpose,
            visitDate: createDto.reviewDetail.visitDate ?? null,
          },
        },
      },
    });

    const pointInput: IUserPoint = {
      userId,
      venueId: venueId,
      pointType: PointType.REVIEW_WRITE,
    };

    this.event.emit('review.created', pointInput);
    this.event.emit('reviewrating.created', venueId);
    return review;
  }

  //Update
  async UpdateReview(reviewId: string, updateDto: ReviewUpdateDto) {
    const targetReview = await this.prisma.client.review.findFirst({
      where: { id: reviewId, deletedAt: null },
      select: { rating: true, contents: true, venueId: true },
    });
    if (!targetReview)
      throw new NotFoundException('Review가 존재하지 않습니다');

    if (updateDto.rating) {
      await this.prisma.client.review.update({
        where: { id: reviewId },
        data: { rating: updateDto.rating },
      });
      //review rating변경에 대한 재집계
      this.event.emit('reviewrating.updated', targetReview.venueId);
    }

    if (updateDto.contents) {
      const existingContents = (
        typeof targetReview.contents === 'string'
          ? JSON.parse(targetReview.contents) // 문자열이면 객체로 변환
          : targetReview.contents
      ) as Record<Language, string>;
      await this.prisma.client.review.update({
        where: { id: reviewId },
        data: {
          contents: {
            ...existingContents,
            ...updateDto.contents,
          },
        },
      });
    }
    return await this.prisma.client.review.findFirst({
      where: { id: reviewId, deletedAt: null },
    });
  }
  //review에 대해 "도움이 됐어요"표시 (토글)
  async createHelpful(reviewId: string, userId: string) {
    const targetHelpful = await this.prisma.client.reviewHelpful.findUnique({
      where: { reviewId_userId: { reviewId, userId } },
    });
    //Event의 Input설정
    const pointInput: IUserPoint = {
      userId,
      pointType: PointType.HELPFUL_RECEIVED,
    };
    //도움이 되어요가 기존에 있는 경우 삭제 토글 및 포인트 차감
    if (targetHelpful) {
      await this.prisma.client.reviewHelpful.delete({
        where: { reviewId_userId: { reviewId, userId } },
      });
      //포인트 삭제
      this.event.emit('helpful.removed', pointInput);
      return { reviewHelpful: false };
      //도움이 되어요가 기존에 없는 경우 생성 후 포인트 부여
    } else {
      await this.prisma.client.reviewHelpful.create({
        data: { userId, reviewId },
      });
      //포인트 생성
      this.event.emit('helpful.received', pointInput);
      return { reviewHelpful: true };
    }
  }

  async deleteReview(userId: string, reviewId: string) {
    const targetReview = await this.prisma.client.review.findUnique({
      where: { id: reviewId },
    });
    if (!targetReview) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }
    if (targetReview?.userId !== userId)
      throw new ForbiddenException('삭제 권한이 없습니다');
    await this.prisma.client.review.delete({
      where: { id: reviewId },
    });
  }
}
