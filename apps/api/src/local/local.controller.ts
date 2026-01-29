import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalVerificationCreateDto } from '@triptags/shared';
import { create } from 'domain';

@Controller('local_verification')
@ApiBearerAuth('access-token')
@ApiTags('local_verification')
export class LocalVerificationController {
  @Post(':venueId')
  @UseGuards(JwtAccessGuard)
  handleCreateLocalVerification(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() createDto: LocalVerificationCreateDto,
  ) {
    this.handleCreateLocalVerification(user.id, venueId, createDto){
    }
  }
}
