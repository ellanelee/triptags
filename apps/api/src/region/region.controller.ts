import { ApiTags } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

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
}
