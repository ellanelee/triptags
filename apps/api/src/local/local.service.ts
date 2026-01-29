import { PrismaService } from '@/prisma/prisma.service';
import { calculateDistance } from '@/utils/location.utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LocalVerificationCreateDto } from '@triptags/shared';

@Injectable()
export class LocalVerificationService {
  constructor(private prisma: PrismaService) {}

  async createVerification(
    userId: string,
    venueId: string,
    createDto: LocalVerificationCreateDto,
  ) {
    //주소 정보로 인증
    const profile = await this.prisma.client.userProfile.findFirst({
      where: { id: userId, deletedAt: null },
      select: { regionId: true, longitude: true, latitude: true },
    });
    if (!profile || !profile.latitude || !profile.longitude) {
      throw new BadRequestException('사용자의 주소가 필요합니다');
    }

    const distance = calculateDistance(
      { lat: profile.latitude, lng: profile.longitude },
      { lat: createDto.latitude, lng: createDto.longitude },
    );

    //거리 15km초과시
    if (distance > 15000) {
      throw new BadRequestException('허용된 거리범위를 벗어납니다');
    }
    return await this.prisma.client.localVerification.create({
      data: {
        userId,
        regionId: profile.regionId,
        longitude: createDto.longitude,
        latitude: createDto.latitude,
        verificationMethod: createDto.verificationMethod,
      },
    });
  }
}
