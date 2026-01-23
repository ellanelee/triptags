import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { VenuePaginationDto } from '@triptags/shared';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async findReviewByVenueId(venueId: string, pageDto: VenuePaginationDto) {
    const page = Number(pageDto.page) || 1;
    const items = Number(pageDto.items) || 10;
    const skip = (page - 1) * items;
    const [totalCount, data] = await Promise.all([
      this.prisma.client.review.count({ where: { venueId, deletedAt: null } }),
      this.prisma.client.review.findMany({
        where: { venueId, deletedAt: null },
        skip,
        take: items,
        orderBy: { updatedAt: 'desc' },
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
}
