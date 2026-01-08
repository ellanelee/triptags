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
    const root_parent_id = 'defautParentIdToPreventError';
    const countryNode = await this.prisma.region.upsert({
      where: {
        region_depth: {
          parentId: root_parent_id,
          name: country,
          level: 1,
        },
      },
      update: {},
      create: { name: country, level: 1 },
    });
    const cityNode = await this.prisma.region.upsert({
      where: {
        region_depth: { parentId: countryNode.id, name: city, level: 2 },
      },
      update: {},
      create: { name: city, level: 2 },
    });
    const districtNode = await this.prisma.region.upsert({
      where: {
        region_depth: { parentId: cityNode.id, name: district, level: 3 },
      },
      update: {},
      create: { name: city, level: 3 },
    });
    return districtNode.id;
  }
}
