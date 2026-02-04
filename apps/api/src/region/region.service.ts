import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  norm(regionSeparated: string, isCountry?: boolean) {
    if (isCountry) {
      regionSeparated = regionSeparated.toUpperCase();
    }
    return regionSeparated.trim().replace(/\s+/g, ' ');
  }

  async getOrCreateRegionHistory(
    country: string,
    city: string,
    district: string,
  ) {
    const normalizedCountry = this.norm(country, true);
    const normalizedCity = this.norm(city);
    const normalizedDistrict = this.norm(district);

    const countryNode =
      (await this.prisma.client.region.findFirst({
        where: {
          parentId: null,
          name: normalizedCountry,
          level: 1,
        },
      })) ??
      (await this.prisma.client.region.create({
        data: { name: normalizedCountry, level: 1, parentId: null },
      }));
    const cityNode = await this.prisma.client.region.upsert({
      where: {
        region_depth: {
          parentId: countryNode.id,
          name: normalizedCity,
          level: 2,
        },
      },
      update: {},
      create: { name: normalizedCity, level: 2, parentId: countryNode.id },
    });
    const districtNode = await this.prisma.client.region.upsert({
      where: {
        region_depth: {
          parentId: cityNode.id,
          name: normalizedDistrict,
          level: 3,
        },
      },
      update: {},
      create: { name: normalizedDistrict, level: 3, parentId: cityNode.id },
    });
    return districtNode.id;
  }

  async getCountryIdByCode(countryCode: string) {
    const targetCountryCode = this.norm(countryCode, true);
    const targetCountry = await this.prisma.client.region.findFirst({
      where: { name: targetCountryCode, level: 1 },
      select: { id: true },
    });
    if (!targetCountry)
      throw new BadRequestException('국가 코드가 적절하지 않습니다');
    return targetCountry.id;
  }
  async getSubRegion(parentId: string) {
    return this.prisma.client.region.findMany({
      where: { parentId: parentId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, level: true },
    });
  }
}
