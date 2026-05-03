import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { I18nText } from '../../../../../../../개인프로젝트/triptags/packages/shared/dist/cjs';
import { IVenueDetailInput } from '@triptags/shared';

export class VenueDetailDto implements IVenueDetailInput {
  @ApiProperty({
    example: '010123445678',
    description: '업장의 전화번호를 등록해주세요',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: '20000-50000',
    description: '최대와 최소가격대를 등록해주세요',
  })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @ApiProperty({
    example: '한식',
    description: '주어진 카테고리내에서 특화된 내용을 넣어주세요',
  })
  @IsString()
  subCategory?: string;

  @IsOptional()
  @ApiProperty({
    example: 'www.naver.com',
    description: 'venue의 website가 있다면 넣어주세요',
  })
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @ApiProperty({
    example: "{ko: '월~토 9:00 ~ 20:00, 일요일 휴무, 설/추석연휴 휴무'}",
    description: '영업일과 영업시간에 대한 정보를 입력해주세요.',
  })
  workHour?: I18nText;
}
