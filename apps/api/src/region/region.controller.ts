import { ApiTags } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegionSearchDto } from '@triptags/shared';

@Controller('regions')
@ApiTags('regions')
export class RegionController {
  constructor(private regionService: RegionService) {}

  //region명과 parentId로 regionId검색
  @Get('region')
  async handleRegionId(
    @Query('code') code: string,
    @Query('parentId') parentId: string,
  ) {
    await this.regionService.getRegionId(code, parentId);
  }

  //regionId로 하위 region검색
  @Get('regions')
  async handleSearchSubRegion(@Param('regionId') regionId: string) {
    await this.regionService.getSubRegion(regionId);
  }

  //특정 지역의 정보로 Venue검색 (사용자 선호지역의 venue정보 및 region hierachy에 의한 검색)
  @Get('places')
  async handleGetVenueByRegion(@Query() searchDto: RegionSearchDto) {
    const parentId = searchDto.parentId ?? null;
    return await this.regionService.getVenueByRegion(searchDto.code, parentId);
  }
}
