import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RegionService } from '@/region/region.service';
import { VenueCreateDto } from '@triptags/shared';

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

  async createVenue(userId: string, venueCreateDto: VenueCreateDto) {
    const newRegionId = await this.region.getOrCreateRegionHistory(
      venueCreateDto.country,
      venueCreateDto.city,
      venueCreateDto.district,
    );
    return await this.prisma.client.venue.create({
      data: {
        name: venueCreateDto.name,
        description: venueCreateDto.description,
        venueCategory: venueCreateDto.venueCategory,
        longitude: venueCreateDto.longitude,
        latitude: venueCreateDto.latitude,
        googlePlaceId: venueCreateDto.googlePlaceId,
        regionId: newRegionId,
        createdBy: userId,
      },
    });
  }
}
