import { ApiTags } from '@nestjs/swagger';
import { RegionService } from './region.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  createResponse,
  RegionCreateDto,
  RegionSearchDto,
} from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { RolesGuard } from '@/auth/jwt-auth.guard.ts/roels.guard';

@Controller('regions')
@ApiTags('regions')
export class RegionController {
  constructor(private regionService: RegionService) {}

  //code와 parentId로 하위regionId겁색
  @Get('id')
  async handleRegionId(
    @Query('code') code: string,
    @Query('parentId') parentId: string,
  ) {
    const data = await this.regionService.getRegionId(code, parentId ?? null);
    return createResponse(true, data);
  }

  //regionId로 1단계 하단의 region검색
  @Get(':regionId/sub')
  async handleSearchSubRegion(@Param('regionId') regionId: string) {
    const data = await this.regionService.getSubRegion(regionId);
    return createResponse(true, data);
  }

  //regionId(districtId)로 상위 지역정보
  @Get(':regionId/hierarchy')
  async handleHierachicalRegion(@Param('regionId') regionId: string) {
    const userProfile =
      await this.regionService.getRegionHierachicalInfo(regionId);
    return createResponse(true, userProfile);
  }

  //특정 지역의 정보로 Venue검색 (사용자 선호지역의 venue정보 및 region hierachy에 의한 검색)
  @Get('places')
  async handleGetVenueByRegion(@Query() searchDto: RegionSearchDto) {
    const parentId = searchDto.parentId ?? null;
    return await this.regionService.getVenueByRegion(searchDto.code, parentId);
  }

  //국가/도시/지역 정보로 regionId검색 (district Id를 가져옴)
  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  async handlecreateRegion(@Body() createDto: RegionCreateDto) {
    return await this.regionService.getOrCreateRegionHistory(
      createDto.country,
      createDto.city,
      createDto.district,
    );
  }
}
