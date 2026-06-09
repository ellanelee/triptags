import { ApiProperty } from '@nestjs/swagger';
import { IReviewCreateWithDetailInput } from '@triptags/shared';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ReviewCreateDto } from './reviewcreate.dto';
import { ReviewDetailCreateDto } from '@/reviewDetail/dtos/reviewdetailcreate.dto';
import { Type } from 'class-transformer';

export class ReviewUpdateDto
  extends ReviewCreateDto
  implements IReviewCreateWithDetailInput
{
  @ApiProperty({
    type: ReviewDetailCreateDto,
    description: '리뷰 상세정보 추가',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReviewDetailCreateDto)
  reviewDetail!: ReviewDetailCreateDto;
}
