import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.venue.findMany({
      include: {
        venueDetail: true,
        region: true,
      },
    });
  }
}
