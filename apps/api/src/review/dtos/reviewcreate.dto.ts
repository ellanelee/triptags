import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { I18nText, IReviewCreateInput } from '@triptags/shared';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class ReviewCreateDto implements IReviewCreateInput {
  @ApiProperty({
    example: 5,
    description: '장소에 대한 선호도 점수평가 (1~5)',
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  rating!: number;

  @ApiProperty({
    example: { ko: '음식이 맛있지만 줄을 많이 서야해요.' },
    description: '장소에 대한 설명, 언어는 ko/en/ja/zh/es/fr/de중에 선택',
  })
  @IsNotEmpty()
  contents!: I18nText;

  @ApiPropertyOptional({
    description: '로컬 인증이 완료된 경우 연결할 인증 ID',
    example: 'a3b2c1d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsUUID()
  localVerificationId?: string;
}
