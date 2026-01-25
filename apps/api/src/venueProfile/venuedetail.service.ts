import { PrismaService } from '@/prisma/prisma.service';
import { VenueService } from '@/venue/venue.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { VenueDetailDto } from '@triptags/shared';

@Injectable()
export class VenueDetailService {
  constructor(
    private readonly vanueService: VenueService,
    private prisma: PrismaService,
  ) {}

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

  async createVenueDetail(
    user: User,
    venueId: string,
    venueDetailDto: VenueDetailDto,
  ) {
    const targetVenue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
    });
    //Venue작성자이거나 Admin이 아니면 등록불가
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');
    if (targetVenue.createdBy !== user.id || user?.role !== 'ADMIN')
      throw new UnauthorizedException('등록 권한이 없습니다');
    return this.prisma.client.venueDetail.upsert({
      where: { venueId },
      update: { ...venueDetailDto },
      create: {
        ...venueDetailDto,
        venue: { connect: { id: venueId } },
      },
    });
  }
}
