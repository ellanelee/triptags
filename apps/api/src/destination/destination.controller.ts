import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { User } from '@prisma/client';
import { DestinationCreateDto } from '@triptags/shared';

@ApiBearerAuth('access-token')
@Controller()
@ApiTags('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}
  @Post()
  @UseGuards(JwtAccessGuard)
  async handleCreateDestination(
    @CurrentUser() user: User,
    @Body() destinationDto: DestinationCreateDto,
  ) {
    return this.destinationService.createDestination(user.id, destinationDto);
  }
}
