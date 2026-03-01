import { Module } from '@nestjs/common';
import { UserPointService } from './userpoint.service';
import { UserPointController } from './userpoint.controller';

@Module({
  controllers: [UserPointController],
  providers: [UserPointService],
  exports: [UserPointService],
})
export class UserPointModule {}
