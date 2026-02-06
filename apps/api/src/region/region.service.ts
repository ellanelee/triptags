import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getRegionId(code: string, parentId: string | null) {
    //정규화하여 국가코드 여부를 검증한후 Id추출
    let isCountry = false;
    let currentLevel = 1; //국가코드로 기본 옵션 설정
    let targetCode = code;
    //국가 코드 옵션으로 요청되는 경우
    if (parentId === null) {
      isCountry = true;
      targetCode = this.norm(code, isCountry);
      const isValidCountry = CountryUtils.isValidCountryCode(targetCode);
      if (!isValidCountry)
        throw new BadRequestException('국가 코드 입력값이 적절하지 않습니다');
    } else {
      //광역시/도 혹은 시/군/구로 요청되는 경우
      const parentNode = await this.prisma.client.region.findFirst({
        where: { parentId: parentId },
        select: { level: true },
      });
      if (!parentNode)
        throw new BadRequestException('입력값이 적절하지 않습니다');
      currentLevel = parentNode.level == 1 ? 2 : 3;
      targetCode = this.norm(code, isCountry);
    }

    //국가 코드인 경우 1level로 검색, 도시코드인 경우2, 지역코드인 경우3으로 검색
    const targetRegion = await this.prisma.client.region.findFirst({
      where: {
        name: targetCode,
        level: currentLevel,
        parentId: isCountry ? null : parentId,
      },
      select: { id: true },
    });
    if (!targetRegion) throw new NotFoundException('지역을 검색할수 없습니다');
    return targetRegion.id;
  }

  async getSubRegion(parentId: string) {
    const parentNode = await this.prisma.client.region.findUnique({
      where: { id: parentId },
      select: { id: true, name: true, level: true },
    });
    if (!parentNode)
      throw new BadRequestException('지역 정보가 존재하지 않습니다');
    if (parentNode?.level >= 3) {
      return [];
    }

    return await this.prisma.client.region.findMany({
      where: { parentId: parentId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, level: true },
    });
  }

  async getVenueByRegion(code: string, parentId: string | null) {
    const regionId = await this.getRegionId(code, parentId);
    return this.prisma.client.venue.findMany({
      where: { regionId: regionId },
    });
  }
}
