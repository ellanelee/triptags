import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RegionService } from '@/region/region.service';
import { I18nText, Language, SUPPORTED_LANGUAGES } from '@triptags/shared';
import { PointType, Prisma, UserRole } from '@prisma/client';
import { IUserPoint } from '@/common/type/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VenuePaginationDto } from './dtos/venuepagination.dto';
import { CountryUtils } from '@/utils/country.utils';
import { VenueCreateDto } from './dtos/venuecreate.dto';
import { VenueUpdateDtoUser } from './dtos/venueupdateuser.dto';
import { VenueUpdateDto } from './dtos/venueupdate.dto';

const venueBaseInclude = {
  venueDetail: true,
  region: {
    include: {
      parent: {
        include: {
          parent: true,
        },
      },
    },
  },
  venueImages: true,
  venueStats: true,
  _count: {
    select: { review: true },
  },
};

const venueEditBaseInclude = {
  venueDetail: true,
  region: {
    include: {
      parent: {
        include: {
          parent: true,
        },
      },
    },
  },
  venueImages: true,
};

@Injectable()
export class VenueService {
  constructor(
    private prisma: PrismaService,
    private region: RegionService,
    private readonly event: EventEmitter2,
  ) {}

  //local과 일반 review를 구분하여 처리
  private async getVenueReviewData(venueId: string) {
    const [total, local, normal] = await Promise.all([
      this.prisma.client.review.aggregate({
        where: {
          venueId,
          deletedAt: null,
        },
        _count: { id: true },
        _avg: { rating: true },
      }),
      this.prisma.client.review.aggregate({
        where: { venueId, localVerificationId: { not: null } },
        _count: { id: true },
        _avg: { rating: true },
      }),
      this.prisma.client.review.aggregate({
        where: { venueId, localVerificationId: null },
        _count: { id: true },
        _avg: { rating: true },
      }),
    ]);
    return {
      total: { count: total._count.id, averageRating: total._avg.rating ?? 0 },
      local: { count: local._count.id, averageRating: local._avg.rating ?? 0 },
      normal: {
        count: normal._count.id,
        averageRating: normal._avg.rating ?? 0,
      },
    };
  }

  //venueId로 기본정보조회
  private findActiveVenueById(venueId: string) {
    return this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
    });
  }

  //venueId로 venue기본정보 및 관련 정보찾기
  async findVenueById(venueId: string) {
    const response = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
      include: venueBaseInclude,
    });
    const reviewSummary = await this.getVenueReviewData(venueId);

    return {
      ...response,
      reviewSummary,
    };
  }

  async findVenueEditById(userId: string, venueId: string) {
    const targetUser = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });
    if (!targetUser) throw new NotFoundException('사용자가 존재하지 않습니다');
    const targetVenue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
      include: venueEditBaseInclude,
    });

    const isAdmin = targetUser.role === 'ADMIN';
    const isCreator = targetVenue?.createdBy === userId;

    if (isAdmin || isCreator) {
      return targetVenue;
    } else {
      console.log('venue생성자나 관리자만 수정이 가능합니다.');
      throw new ForbiddenException('Unauthorized User for Venue');
    }
  }

  //검색어, 카테고리, 지역정보 검색후 조회 (페이지 반영한 response)
  async findAllAbstract(paginationDto: VenuePaginationDto) {
    const {
      page = 1,
      items = 10,
      search,
      category,
      country,
      city,
      district,
    } = paginationDto;
    const skip = (page - 1) * items;
    const where: Prisma.VenueWhereInput = {
      deletedAt: null,
    };

    if (category) where.venueCategory = category;

    if (district || city || country) {
      where.region = {
        level: 3,
        ...(district && { name: { contains: district } }),
        ...(city && { parent: { name: { contains: city } } }),
        ...(country && {
          parent: {
            parent: {
              name: { contains: CountryUtils.getCountryCode(country) },
            },
          },
        }),
      };
    }

    if (search) {
      where.OR = SUPPORTED_LANGUAGES.flatMap((lang) => [
        {
          name: {
            path: [lang],
            string_contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            path: [lang],
            string_contains: search,
            mode: 'insensitive',
          },
        },
      ]);
    }

    const [totalCount, data] = await Promise.all([
      this.prisma.client.venue.count({ where }),
      this.prisma.client.venue.findMany({
        where,
        skip,
        take: items,
        include: venueBaseInclude,
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

  //Venue이름 변경
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

  //Venue설명 변경
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

  //venueImage불러오기
  async findVenueImageById(venueId: string) {
    return await this.prisma.client.venueImage.findFirst({
      where: { venueId: venueId },
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

  //Venue생성
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
        detailedAddress: venueCreateDto.details,
        longitude: venueCreateDto.longitude,
        latitude: venueCreateDto.latitude,
        googlePlaceId: venueCreateDto.googlePlaceId,
        regionId: newRegionId,
        createdBy: userId,
        venueImages: venueCreateDto.venueImage?.length
          ? {
              create: venueCreateDto.venueImage.map((image, index) => ({
                imageUrl: image,
                isThumbnail: index === 0,
              })),
            }
          : undefined,
      },
    });
    const pointInput: IUserPoint = {
      userId,
      venueId: createdVenue.id,
      pointType: PointType.VENUE_CREATE,
    };

    //Venue생성에 대해 UserPoint로 알림
    this.event.emit('venue.created', pointInput);

    return createdVenue;
  }

  //사용자 venue추가 (언어별 장소명칭 및 이름)
  async updateVenueByCreator(
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
    if (updateDto.description) {
      await this.updateVenueDescriptionById(venueId, updateDto.description);
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
  async updateVenueByAdmin(
    userId: string,
    venueId: string,
    updateDto: VenueUpdateDto,
  ) {
    const targetVenue = await this.findActiveVenueById(venueId);
    const adminUser = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });
    if (!targetVenue) throw new NotFoundException('데이터가 존재하지 않습니다');
    if (adminUser?.role !== 'ADMIN')
      throw new UnauthorizedException('업데이트 권한이 없습니다');

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
