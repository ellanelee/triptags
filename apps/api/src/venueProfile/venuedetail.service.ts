import { PrismaService } from '@/prisma/prisma.service';
import { VenueService } from '@/venue/venue.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { VenueCreateDetailDto } from '@triptags/shared';

@Injectable()
export class VenueDetailService {
  constructor(
    private readonly vanueService: VenueService,
    private prisma: PrismaService,
  ) {}

  async createVenueDetail(
    userId: string,
    venueId: string,
    createDto: VenueCreateDetailDto,
  ) {
    const targetVenue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
    });
    if (targetVenue && targetVenue.createdBy !== userId)
      throw new UnauthorizedException('수정 권한이 없습니다');
    return this.prisma.client.venueDetail.create({
      data: {
        phoneNumber: createDto.phoneNumber,
        priceRange: createDto.priceRange,
        subCategory: createDto.subCategory,
        websiteUrl: createDto.websiteUrl,
        venueId: venueId,
      },
    });
  }
  async getVenueDetailById(venueId: string) {
    const targetVenue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
    });
    if (targetVenue)
      throw new UnauthorizedException('데이터를 찾을수 없습니다');
    return this.prisma.client.venueDetail.findFirst({
      where: { venueId },
    });
  }
}
