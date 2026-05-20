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
import { createResponse } from '@triptags/shared';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { Roles } from '@/common/decorator/roles.decorator';
import { RolesGuard } from '@/auth/jwt-auth.guard.ts/roels.guard';
import { VenuePaginationDto } from './dtos/venuepagination.dto';
import { VenueCreateDto } from './dtos/venuecreate.dto';
import { VenueUpdateDto } from './dtos/venueupdate.dto';
import { VenueUpdateDtoUser } from './dtos/venueupdateuser.dto';

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
  @Get(':venueId')
  async getVenueById(@Param('venueId') venueId: string) {
    const result = await this.venueService.findVenueById(venueId);
    return createResponse(true, result);
  }

  //VenueId로 update를 위한 정보 불러오기
  @UseGuards(JwtAccessGuard)
  @Get(':venueId/edit')
  async getVenueEditById(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
  ) {
    const result = await this.venueService.findVenueEditById(user.id, venueId);
    return createResponse(true, result);
  }

  //VenueId로 이미지 불러오기
  @Get(':venueId/image')
  async getVenueImageById(@Param('venueId') venueId: string) {
    const response = await this.venueService.findVenueImageById(venueId);
    return createResponse(true, response);
  }

  //Venue생성하기
  @Post()
  @UseGuards(JwtAccessGuard)
  async createVenue(
    @CurrentUser() user: User,
    @Body() venueCreateDto: VenueCreateDto,
  ) {
    console.log(user);
    const response = await this.venueService.createVenue(
      user.id,
      venueCreateDto,
    );
    return createResponse(true, response);
  }

  //관리자의 venue수정 (모든 필드 수정가능)
  @Patch(':id/admin')
  @Roles('ADMIN')
  @UseGuards(JwtAccessGuard, RolesGuard)
  async updateVenueByAdmin(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
    @Body() venueUpdateDto: VenueUpdateDto,
  ) {
    console.log(user);
    const response = await this.venueService.updateVenueByAdmin(
      user.id,
      venueId,
      venueUpdateDto,
    );
    return createResponse(true, response);
  }

  //사용자(생성자)의 venue수정 (name, image수정)
  @Patch(':id/user')
  @UseGuards(JwtAccessGuard)
  async updateVenueByCreator(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
    @Body() venueUpdateDto: VenueUpdateDtoUser,
  ) {
    const response = await this.venueService.updateVenueByCreator(
      user.id,
      venueId,
      venueUpdateDto,
    );
    return createResponse(true, response);
  }

  //Venue비활성화
  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAccessGuard, RolesGuard)
  async inactivateVenue(
    @CurrentUser() user: User,
    @Param('id') venueId: string,
  ) {
    const response = await this.venueService.deleteVenue(user.role, venueId);
    return createResponse(true, response);
  }
}
