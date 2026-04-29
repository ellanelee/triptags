import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createResponse } from '@triptags/shared';
import { LocalVerificationService } from './local.service';
import { User } from '@prisma/client';
import { LocalVerificationCreateDto } from './dto/localverficationcreated.dto';

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
    @Body() createDto?: LocalVerificationCreateDto,
  ) {
    const response = await this.localVerificationService.createVerification(
      user.id,
      venueId,
      createDto,
    );
    console.log(response);
    return createResponse(true, response);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async handleGetLocalVerification(@CurrentUser() user: User) {
    await this.localVerificationService.getVerification(user.id);
  }
}
