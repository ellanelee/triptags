import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Language, VenueCategory } from '@triptags/shared';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VenueDuplicatedDto {
  @ApiProperty({
    example: 'ko',
    description: '언어코드',
    enum: ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de'],
  })
  @IsString()
  language!: Language;

  @ApiProperty({
    example: '진주집',
    description: '장소의 이름',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'RESTAURANT',
    description:
      'RESTAURANT(식당), CAFE(카페), HOTEL(호텔), STREET_FOOD(거리음식), BAR(바),SHOPPING(쇼핑), CULTURE(문화) 등등, 하단에서 적절한 영역으로 설정하세요',
  })
  @IsNotEmpty()
  venueCategory?: VenueCategory;

  @ApiProperty({
    example: 'KR',
    description: '거주 국가명의 영문명(KR, UK, USA등등)',
  })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({
    example: '서울특별시',
    description: '행정구역(서울특별시/부산광역시/경기도)',
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({
    example: '영등포구',
    description: '군/구',
  })
  @IsString()
  @IsNotEmpty()
  district!: string;

  @ApiProperty({
    example: '국제금융로6길 33 지하1층 ',
    description: '상세 주소(건물명, 호수등 상세주소)',
  })
  @IsString()
  @IsNotEmpty()
  details!: string;

  @ApiProperty({
    example: 37.5227,
    description: '사용자 위치(위도)',
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    example: 126.927,
    description: '사용자 위치(경도)',
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    example: 12345,
    description: '구글 PlaceID',
  })
  @IsString()
  @IsOptional()
  googlePlaceId?: string;
}
