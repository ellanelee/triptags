import { ApiTags } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegionSearchDto } from '@triptags/shared';

@Controller('region')
@ApiTags('region')
export class RegionController {
  constructor(private regionService: RegionService) {}

  @Get('regionId')
  async handleRegionId(
    @Query('code') code: string,
    @Query('parentId') parentId: string,
  ) {
    await this.regionService.getRegionId(code, parentId);
  }

  @Get('regions')
  async handleSearchRegion(@Param('parentId') parentId: string) {
    await this.regionService.getSubRegion(parentId);
  }

  //특정 지역의 정보로 Venue검색 (사용자 선호지역의 venue정보 및 region hierachy에 의한 검색)
  @Get('places')
  async handleGetVenueByRegion(@Query() searchDto: RegionSearchDto) {
    const parentId = searchDto.parentId ?? null;
    return await this.regionService.getVenueByRegion(searchDto.code, parentId);
  }
}
