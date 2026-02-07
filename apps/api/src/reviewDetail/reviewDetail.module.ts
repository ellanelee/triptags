import { Module } from '@nestjs/common';
import { ReviewDetailController } from './reviewDetail.controller';
import { ReviewDetailService } from './reviewDetail.service';

@Module({
  controllers: [ReviewDetailController],
  providers: [ReviewDetailService],
  exports: [ReviewDetailService],
})
export class ReviewDetailModule {}
