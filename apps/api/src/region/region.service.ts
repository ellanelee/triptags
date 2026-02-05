import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryUtils } from '@triptags/shared';

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

  async getRegionId(code: string, parentId: string) {
    //정규화하여 국가코드 여부를 검증한후 Id추출
    const targetCode = this.norm(code, true);
    const isCountry = CountryUtils.isValidCountryCode(targetCode);

    //국가 코드인 경우 1level로 검색
    const targetRegion = await this.prisma.client.region.findFirst({
      where: {
        name: targetCode,
        level: isCountry ? 1 : 2,
        parentId: isCountry ? null : parentId,
      },
      select: { id: true },
    });
    if (!targetRegion) throw new NotFoundException('지역을 검색할수 없습니다');
    return targetRegion.id;
  }

  async getSubRegion(parentId: string) {
    return this.prisma.client.region.findMany({
      where: { parentId: parentId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, level: true },
    });
  }
}
