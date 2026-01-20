import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RegionService } from '@/region/region.service';
import { Language, VenueCreateDto, VenueUpdateDtoUser } from '@triptags/shared';

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
    const lang: Language = venueCreateDto.language;
    const venueNameJson = { [lang]: venueCreateDto.name };
    const descriptionJson = venueCreateDto.description
      ? { [lang]: venueCreateDto.description }
      : undefined;

    return await this.prisma.client.venue.create({
      data: {
        name: venueNameJson,
        description: descriptionJson,
        venueCategory: venueCreateDto.venueCategory,
        longitude: venueCreateDto.longitude,
        latitude: venueCreateDto.latitude,
        googlePlaceId: venueCreateDto.googlePlaceId,
        regionId: newRegionId,
        createdBy: userId,
      },
    });
  }

  //venue영문 이름만 추가
  async updateVenueByUser(
    userId: string,
    venueId: string,
    updateDto: VenueUpdateDtoUser,
  ) {
    //이름과 이미지 Update구분처리
    const hasUpdateName = !!updateDto.name || !!updateDto.language;
    const hasUpdateImage = !!(
      updateDto.venueImage && updateDto.venueImage.length
    );

    if (!hasUpdateName && !hasUpdateImage)
      throw new BadRequestException('수정할 내용이 없습니다');

    const venue = await this.prisma.client.venue.findUnique({
      where: {
        id: venueId,
      },
      select: { id: true, name: true },
    });
    if (!venue) throw new NotFoundException('Venue Not Found');

    const data: {
      name?: Partial<Record<Language, string>>;
      venueImage?: string[];
    } = {};
    if (hasUpdateName && updateDto.language && updateDto.name) {
      const lang: Language = updateDto.language;
      const currentName =
        venue.name &&
        typeof venue.name === 'object' &&
        !Array.isArray(venue.name)
          ? venue.name
          : {};
      data.name = {
        ...currentName,
        [lang]: updateDto.name,
      };
    }
    if (hasUpdateImage) {
      data.venueImage = updateDto.venueImage;
    }
    return this.prisma.client.venue.update({
      where: { id: venueId },
      data,
    });
  }
}
