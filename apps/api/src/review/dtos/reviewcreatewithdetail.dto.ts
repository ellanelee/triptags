import { ApiProperty } from '@nestjs/swagger';
import { ReviewCreateDto } from './reviewcreate.dto';
import { ReviewDetailCreateDto } from '../../reviewDetail/dtos/reviewdetailcreate.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IReviewCreateWithDetailInput } from '@triptags/shared';

export class ReviewCreateWithDetailDto
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
