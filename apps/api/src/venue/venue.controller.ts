import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import {
  createResponse,
  VenueCreateDto,
  VenuePaginationDto,
  VenueUpdateDto,
  VenueUpdateDtoUser,
} from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { Roles } from '@/common/decorator/roles.decorator';
import { RolesGuard } from '@/auth/jwt-auth.guard.ts/roels.guard';

@ApiBearerAuth('access-token')
@ApiTags('venues')
@Controller('venues')
export class VenueController {
  constructor(private venueService: VenueService) {}

  //모든 Venue정보 가져오기
  @Get('all')
  async getAllVenues(@Query() paginationDto: VenuePaginationDto) {
    console.log(paginationDto);
    const response = await this.venueService.findAllAbstract(paginationDto);
    return createResponse(true, response);
  }

  //VenueId로 정보 불러오기
  @Get(':venueId/venue')
  async getVenueById(venueId: string) {
    const result = await this.venueService.findVenueById(venueId);
    return createResponse(true, result);
  }

  //VenueId로 이미지 불러오기
  @Get(':venueId')
  async getVenueImageById(venueId: string) {
    return await this.venueService.findVenueImageById(venueId);
  }

  //Venue생성하기
  @Post()
  @UseGuards(JwtAccessGuard)
  async createVenue(
    @CurrentUser() user: User,
    @Body() venueCreateDto: VenueCreateDto,
  ) {
    console.log(user);
    return await this.venueService.createVenue(user.id, venueCreateDto);
  }

  //사용자의 venue수정 (언어별 이름/이미지 추가가능)
  @Patch(':id/user')
  @UseGuards(JwtAccessGuard)
  async updateVenueByUser(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
    @Body() venueUpdateDtoUser: VenueUpdateDtoUser,
  ) {
    console.log(user);
    return await this.venueService.updateVenueByUser(
      user.id,
      venueId,
      venueUpdateDtoUser,
    );
  }

  //관리자의 venue수정 (모든 필드 수정가능)
  @Patch(':id/admin')
  @Roles('ADMIN')
  @UseGuards(JwtAccessGuard, RolesGuard)
  async updateVenue(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
    @Body() venueUpdateDto: VenueUpdateDto,
  ) {
    console.log(user);
    return await this.venueService.updateVenue(
      user.id,
      venueId,
      venueUpdateDto,
    );
  }

  //Venue비활성화
  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAccessGuard, RolesGuard)
  async inactivateVenue(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
  ) {
    return await this.venueService.deleteVenue(user.role, venueId);
  }
}
