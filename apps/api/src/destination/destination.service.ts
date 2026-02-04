import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DestinationCreateDto } from '@triptags/shared';

@Injectable()
export class DestinationService {
  constructor(private prisma: PrismaService) {}

  //선호 여행지 등록
  async createDestination(userId: string, createDto: DestinationCreateDto) {
    const targetRegion = await this.prisma.client.region.findFirst({
      where: {
        name: createDto.district,
        level: 3,
        parent: {
          name: createDto.city,
          level: 2,
        },
      },
      select: { id: true },
    });
    if (!targetRegion?.id)
      throw new NotFoundException('등록할수 있는 region이 없습니다');
    await this.prisma.client.destination.create({
      data: {
        userId: userId,
        regionId: targetRegion.id,
        priority: createDto.priority,
      },
    });
  }
}
