import { Module } from '@nestjs/common';
import { UserPointService } from './userpoint.service';

@Module({
  providers: [UserPointService],
  exports: [UserPointService],
})
export class UserPointModule {}
