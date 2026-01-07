import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
