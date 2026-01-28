import {
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
import { VenuePaginationDto } from '@triptags/shared';
import { PointType, UserRole } from '@prisma/client';
import { UserPointService } from '@/userpoint/userpoint.service';
import { IUserPoint } from '@/common/type/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class VenueService {
  constructor(
    private prisma: PrismaService,
    private region: RegionService,
    private userPoint: UserPointService,
    private readonly event: EventEmitter2,
  ) {}

  private findActiveVenueById(venueId: string) {
    return this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
    });
  }

  async findAll(paginationDto: VenuePaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const items = Number(paginationDto.items) || 10;
    const skip = (page - 1) * items;
    const [totalCount, data] = await Promise.all([
      this.prisma.client.venue.count(),
      this.prisma.client.venue.findMany({
        skip,
        take: items,
        include: {
          venueDetail: true,
          region: true,
        },
        orderBy: { createdAt: 'desc' },
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

  async findVenueById(venueId: string) {
    return await this.prisma.client.venue.findFirst({
      where: {
        id: venueId,
      },
    });
  }

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
      where: { id: venueId, deletedAt: null },
      data: { name: targetName },
    });
  }
  async updateVenueDescriptionById(
    venueId: string,
    venueDescription: I18nText,
  ) {
    const targetVenue = await this.findVenueById(venueId);
    if (!venueId || !venueDescription)
      throw new NotFoundException('수정할 데이터가 없습니다');
    if (!targetVenue)
      throw new NotFoundException('관련 데이터를 찾을수 없습니다');

    const currentDescription =
      targetVenue.description &&
      typeof targetVenue.description === 'object' &&
      !Array.isArray(targetVenue.description)
        ? targetVenue.description
        : {};

    const targetDescription = { ...currentDescription, ...venueDescription };
    await this.prisma.client.venue.update({
      where: { id: venueId, deletedAt: null },
      data: { description: targetDescription },
    });
  }

  //DB의 venueImage수정
  async updateVenueImageById(venueId: string, targetImages: string[]) {
    const targetVenue = await this.findActiveVenueById(venueId);
    if (!venueId || !targetImages || targetImages.length === 0)
      throw new NotFoundException('수정할 데이터가 없습니다');
    if (!targetVenue)
      throw new NotFoundException('관련 데이터를 찾을수 없습니다');

    const imageData = targetImages.map((name, idx) => ({
      imageUrl: name,
      isThumbnail: idx === 0 ? true : false,
    }));

    await this.prisma.client.venue.update({
      where: { id: venueId, deletedAt: null },
      data: {
        venueImages: {
          deleteMany: {},
          create: imageData,
        },
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

    const createdVenue = await this.prisma.client.venue.create({
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
    const pointInput: IUserPoint = {
      userId,
      venueId: createdVenue.id,
      pointType: PointType.VENUE_CREATE,
    };

    //Venue생성에 대해 UserPoint로 알림
    this.event.emit('venue.created', pointInput);

    // await this.userPoint.grantPoint(pointInput);
    return createdVenue;
  }

  //사용자 venue추가 (언어별 장소명칭 및 이름)
  async updateVenueByUser(
    userId: string,
    venueId: string,
    updateDto: VenueUpdateDtoUser,
  ) {
    //이름 update
    const targetVenue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
      select: { id: true, createdBy: true },
    });
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');
    if (targetVenue.createdBy !== userId)
      throw new UnauthorizedException('수정 권한이 없습니다');
    if (updateDto.name) {
      await this.updateVenueNameById(venueId, updateDto.name);
    }
    //이미지 Update
    if (updateDto.venueImage) {
      await this.updateVenueImageById(venueId, updateDto.venueImage);
    }
    return await this.prisma.client.venue.findFirst({
      where: { id: venueId },
      select: { name: true, venueImages: true },
    });
  }

  //관리자의 venue update
  async updateVenue(
    userId: string,
    venueId: string,
    updateDto: VenueUpdateDto,
  ) {
    const targetVenue = await this.findActiveVenueById(venueId);
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');

    //venue의 이름 수정
    if (updateDto.name) {
      await this.updateVenueNameById(venueId, updateDto.name);
    }
    //Venue의 Description수정
    if (updateDto.description) {
      await this.updateVenueDescriptionById(venueId, updateDto.description);
    }

    //venue의 이미지 Update
    if (updateDto.venueImage) {
      await this.updateVenueImageById(venueId, updateDto.venueImage);
    }
    //Venue의 googleApiId
    if (updateDto.googlePlaceId) {
      await this.prisma.client.venue.update({
        where: { id: venueId, deletedAt: null },
        data: { googlePlaceId: updateDto.googlePlaceId },
      });
    }
    //venue의 tourApiContentId
    if (updateDto.tourApiContentId) {
      await this.prisma.client.venue.update({
        where: { id: venueId, deletedAt: null },
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

    return await this.prisma.client.venue.findUnique({
      where: { id: venueId },
    });
  }

  async deleteVenue(userRole: UserRole, venueId: string) {
    const targetVenue = await this.findActiveVenueById(venueId);
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');
    if (userRole !== 'ADMIN')
      throw new UnauthorizedException('수정 권한이 없습니다');
    return await this.prisma.client.venue.update({
      where: { id: venueId },
      data: { deletedAt: new Date() },
    });
  }
}
