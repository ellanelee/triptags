import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

//Review올릴때 rating, reviewCount, localRatingAvg에 계산
@Injectable()
export class VenueStatsService {
  constructor(private prisma: PrismaService) {}

  @OnEvent('reviewrating.created')
  @OnEvent('reviewrating.updated')
  async handleUpdateVanueStats(venueId: string) {
    //review에서 평가값의 평균치 (특정 venue기준)
    const stats = await this.prisma.client.review.aggregate({
      where: { venueId: venueId, deletedAt: null },
      _count: { id: true },
      _avg: { rating: true },
    });

    //local인증한 사람의 평균치
    const localStats = await this.prisma.client.review.aggregate({
      where: {
        venueId: venueId,
        deletedAt: null,
        localVerificationId: {
          not: null,
        },
      },
      _avg: { rating: true },
    });

    await this.prisma.client.venueStats.upsert({
      where: { venueId: venueId },
      update: {
        reviewCount: stats._count.id,
        ratingAvg: stats._avg.rating || 0,
        localRatingAvg: localStats._avg.rating || 0,
      },
      create: {
        venueId,
        reviewCount: stats._count.id,
        ratingAvg: stats._avg.rating || 0,
        localRatingAvg: localStats._avg.rating || 0,
      },
    });
  }
}
