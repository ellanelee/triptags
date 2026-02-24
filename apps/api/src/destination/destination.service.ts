import { PrismaService } from '@/prisma/prisma.service';
import { RegionService } from '@/region/region.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DestinationCreateDto } from '@triptags/shared';

@Injectable()
export class DestinationService {
  constructor(
    private prisma: PrismaService,
    private regionService: RegionService,
  ) {}

  //개인별 Destination검색
  async getDestination(userId: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('사용자가 존재하지 않습니다');
    return await this.prisma.client.destination.findMany({
      where: { userId: userId },
    });
  }

  //destination의 regionId에 대해 내용 파악
  async getRegionInfo(userId: string) {
    return await this.prisma.client.destination.findMany({
      where: { userId },
      include: {
        region: {
          select: {
            id: true,
            name: true,
            level: true,
            parent: {
              select: {
                id: true,
                name: true,
                level: true,
                parent: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

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
    console.log(targetRegion);
    if (!targetRegion?.id)
      throw new NotFoundException('등록할수 있는 region이 없습니다');
    const alreadyExisted = await this.prisma.client.destination.findUnique({
      where: {
        userId_regionId: {
          userId: userId,
          regionId: targetRegion.id,
        },
      },
    });
    if (alreadyExisted) throw new BadRequestException('이미 등록된 지역입니다');
    return await this.prisma.client.destination.create({
      data: {
        userId: userId,
        regionId: targetRegion.id,
        priority: createDto.priority,
      },
    });
  }

  async deleteDestination(userId: string, regionId: string) {
    return await this.prisma.client.destination.delete({
      where: {
        userId_regionId: {
          userId: userId,
          regionId: regionId,
        },
      },
    });
  }
}
