import { ApiProperty } from '@nestjs/swagger';
import { IUserIntroductionInput } from '@triptags/shared';
import { IsString } from 'class-validator';

export class UserIntroductionDto implements IUserIntroductionInput {
  @ApiProperty({
    example: '저는 부산에 거주하는 홍길동이예요. 반가워요',
    description: '사용자 소재',
  })
  @IsString()
  introduction!: string;
}
