import { Module } from '@nestjs/common';
import { LocalVerificationService } from './local.service';
import { LocalVerificationController } from './local.controller';
import { UserModule } from '@/user/user.module';
import { VenueModule } from '@/venue/venue.module';
import { UserPointModule } from '@/userpoint/userpoint.module';
import { RegionModule } from '@/region/region.module';

@Module({
  imports: [UserModule, VenueModule, RegionModule, UserPointModule],
  controllers: [LocalVerificationController],
  providers: [LocalVerificationService],
  exports: [LocalVerificationService],
})
export class LocalVerificationModule {}
