import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalVerificationCreateDto } from '@triptags/shared';
import { LocalVerificationService } from './local.service';
import { User } from '@prisma/client';

@Controller('local_verification')
@ApiBearerAuth('access-token')
@ApiTags('local_verification')
export class LocalVerificationController {
  constructor(private localVerificationService: LocalVerificationService) {}

  @Post(':venueId')
  @UseGuards(JwtAccessGuard)
  async handleCreateLocalVerification(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() createDto: LocalVerificationCreateDto,
  ) {
    await this.localVerificationService.createVerification(
      user.id,
      venueId,
      createDto,
    );
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async handleLocalVerification(){
    await this.localVerificationService.
  }
}
