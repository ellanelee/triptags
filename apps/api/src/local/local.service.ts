import { PrismaService } from '@/prisma/prisma.service';
import { calculateDistance } from '@/utils/location.utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VerificationMethod } from '@prisma/client';
import { LocalVerificationCreateDto } from './dto/localverficationcreated.dto';

@Injectable()
export class LocalVerificationService {
  constructor(private prisma: PrismaService) {}

  async createVerification(
    userId: string,
    venueId: string,
    createDto?: LocalVerificationCreateDto,
  ) {
    //venue정보
    const venue = await this.prisma.client.venue.findFirst({
      where: { id: venueId, deletedAt: null },
      select: { longitude: true, latitude: true, regionId: true },
    });
    if (venue === null || venue.longitude === null || venue.latitude === null)
      throw new NotFoundException('요청한 장소 정보를 찾을수 없습니다');

    let localLatitude: number;
    let localLongitude: number;

    //사용자의 위치 정보로 인증하기 위한 설정
    if (!createDto?.verificationMethod)
      throw new BadRequestException('요청 정보를 찾을수 없습니다');

    if (createDto.verificationMethod === 'GPS') {
      if (!createDto.longitude || !createDto.latitude)
        throw new BadRequestException('위치 정보를 찾을수 없습니다');
      localLatitude = createDto.latitude;
      localLongitude = createDto.longitude;
    } else if (createDto.verificationMethod === 'ADDRESS') {
      //사용자의 주소 정보로 인증
      const profile = await this.prisma.client.userProfile.findFirst({
        where: { id: userId, deletedAt: null },
        select: { regionId: true, longitude: true, latitude: true },
      });

      if (!profile || !profile.latitude || !profile.longitude) {
        throw new BadRequestException('사용자의 주소가 필요합니다');
      }
      localLatitude = profile?.latitude;
      localLongitude = profile?.longitude;

      if (createDto && createDto.longitude && createDto.latitude) {
        localLatitude = createDto?.latitude;
        localLongitude = createDto?.longitude;
      }
    } else {
      throw new BadRequestException('지원하지 않는 인증방식입니다');
    }

    //위치 혹은 주소와 venue의 local인증을 위한 거리
    const distance = calculateDistance({
      baseLat: venue.latitude,
      baseLng: venue.longitude,
      localLat: localLatitude,
      localLng: localLongitude,
    });

    console.log(distance);
    //거리 15km초과 이내에서 로컬 인증
    if (distance > 15000) {
      throw new BadRequestException('허용된 거리범위를 벗어납니다');
    }
    if (!venue?.regionId)
      throw new BadRequestException('데이터를 불러오지 못했습니다');

    return await this.prisma.client.localVerification.create({
      data: {
        userId,
        regionId: venue.regionId,
        longitude: localLongitude,
        latitude: localLatitude,
        verificationMethod: createDto.verificationMethod as VerificationMethod,
      },
    });
  }
  async getVerification(userId: string) {
    await this.prisma.client.localVerification.findMany({
      where: { userId: userId, deletedAt: null },
    });
  }
}
