import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}
  async getOrCreateRegionHistory(
    country: string,
    city: string,
    district: string,
  ) {
    const countryNode =
      (await this.prisma.client.region.findFirst({
        where: {
          parentId: null,
          name: country,
          level: 1,
        },
      })) ??
      (await this.prisma.client.region.create({
        data: { name: country, level: 1, parentId: null },
      }));
    const cityNode = await this.prisma.client.region.upsert({
      where: {
        region_depth: { parentId: countryNode.id, name: city, level: 2 },
      },
      update: {},
      create: { name: city, level: 2, parentId: countryNode.id },
    });
    const districtNode = await this.prisma.client.region.upsert({
      where: {
        region_depth: { parentId: cityNode.id, name: district, level: 3 },
      },
      update: {},
      create: { name: district, level: 3, parentId: cityNode.id },
    });
    return districtNode.id;
  }
}
