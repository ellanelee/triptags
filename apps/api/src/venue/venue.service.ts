import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RegionService } from '@/region/region.service';
import {
  I18nText,
  Language,
  VenueCreateDto,
  VenueUpdateDto,
  VenueUpdateDtoUser,
} from '@triptags/shared';

@Injectable()
export class VenueService {
  constructor(
    private prisma: PrismaService,
    private region: RegionService,
  ) {}

  async updateVenueNameById(venueId: string, venueNames: I18nText) {
    const targetVenue = await this.findVenueById(venueId);
    if (!venueId || !venueNames)
      throw new NotFoundException('수정할 데이터가 없습니다');
    if (!targetVenue)
      throw new NotFoundException('관련 데이터를 찾을수 없습니다');

    const currentName =
      targetVenue.name &&
      typeof targetVenue.name === 'object' &&
      !Array.isArray(targetVenue.name)
        ? targetVenue.name
        : {};

    const targetName = { ...currentName, ...venueNames };
    await this.prisma.client.venue.update({
      where: { id: venueId },
      data: { name: targetName },
    });
  }
  async updateVenueImageById(venueId: string, targetImages: string[]) {
    const targetVenue = await this.findVenueById(venueId);
    if (!venueId || !targetImages || targetImages.length !== 0)
      throw new NotFoundException('수정할 데이터가 없습니다');
    if (!targetVenue)
      throw new NotFoundException('관련 데이터를 찾을수 없습니다');

    const imageData = targetImages.map((name, idx) => ({
      venueId,
      imageUrl: name,
      isThumbnail: idx === 0 ? true : false,
    }));

    await this.prisma.client.venue.update({
      where: { id: venueId },
      data: {
        venueImages: {
          deleteMany: {},
          create: imageData,
        },
      },
    });
  }

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

  //사용자 venue추가 (언어별 장소명칭 및 이름)
  async updateVenueByUser(
    userId: string,
    venueId: string,
    updateDto: VenueUpdateDtoUser,
  ) {
    //이름 update
    const targetVenue = await this.prisma.client.venue.findUnique({
      where: { id: venueId },
      select: { id: true, createdBy: true },
    });
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');
    if (targetVenue.createdBy)
      throw new UnauthorizedException('수정 권한이 없습니다');
    if (updateDto.name) {
      await this.updateVenueNameById(venueId, updateDto.name);
    }
    //이미지 Update
    if (updateDto.venueImage) {
      await this.updateVenueImageById(venueId, updateDto.venueImage);
    }
  }

  async updateVenue(
    userId: string,
    venueId: string,
    updateDto: VenueUpdateDto,
  ) {
    const targetVenue = await this.prisma.client.venue.findUnique({
      where: { id: venueId },
    });
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');
    if (targetVenue.createdBy)
      throw new UnauthorizedException('수정 권한이 없습니다');
    //venue의 이름 수정
    if (updateDto.name) {
      await this.updateVenueNameById(venueId, updateDto.name);
    }
    //venue의 이미지 Update
    if (updateDto.venueImage) {
      await this.updateVenueImageById(venueId, updateDto.venueImage);
    }
    //Venue의 googleApiId
    if (updateDto.googlePlaceId) {
      await this.prisma.client.venue.update({
        where: { id: venueId },
        data: { googlePlaceId: updateDto.googlePlaceId },
      });
    }
    //venue의 tourApiContentId
    if (updateDto.tourApiContentId) {
      await this.prisma.client.venue.update({
        where: { id: venueId },
        data: { tourApiContentId: updateDto.tourApiContentId },
      });
    }
    //venue의 지역정보 갱신
    if (
      updateDto.country &&
      !!updateDto.city &&
      !!updateDto.district &&
      !!updateDto.details
    ) {
      await this.region.getOrCreateRegionHistory(
        updateDto.country,
        updateDto.city,
        updateDto.district,
      );
      await this.prisma.client.venue.update({
        where: { id: venueId },
        data: { detailedAddress: updateDto.details },
      });
    }
    //위도 경도 정보
    if (updateDto.longitude) {
      await this.prisma.client.venue.update({
        where: { id: venueId },
        data: { longitude: updateDto.longitude },
      });
    }
  }
}
