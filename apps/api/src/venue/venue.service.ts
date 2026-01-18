import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RegionService } from '@/region/region.service';

@Injectable()
export class VenueService {
  constructor(
    private prisma: PrismaService,
    private region: RegionService,
  ) {}

  async findAll() {
    return await this.prisma.client.venue.findMany({
      include: {
        venueDetail: true,
        region: true,
      },
    });
  }

  async findVenueById(venueId: string) {
    return await this.prisma.client.venue.findFirst({
      where: {
        id: venueId,
      },
    });
  }

  async createVenueById(userId: string, venueId: string) {}
}
