import { Module } from '@nestjs/common';
import { ReviewDetailController } from './reviewDetail.controller';
import { ReviewDetailService } from './reviewDetail.service';
import { ReviewModule } from '@/review/review.module';

@Module({
  imports: [ReviewModule],
  controllers: [ReviewDetailController],
  providers: [ReviewDetailService],
  exports: [ReviewDetailService],
})
export class ReviewDetailModule {}
