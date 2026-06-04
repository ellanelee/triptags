import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { I18nText, VenueCategory } from '@triptags/shared';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class VenueUpdateDto {
  @ApiPropertyOptional({
    example: { ko: '진주집', en: 'JinjuJip' },
    description: '언어별 장소이름',
    enum: ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de'],
  })
  @IsObject()
  name!: I18nText;

  @ApiProperty({
    example: 'RESTAURANT',
    description:
      'RESTAURANT(식당), CAFE(카페), HOTEL(호텔), STREET_FOOD(거리음식), BAR(바),SHOPPING(쇼핑), CULTURE(문화) 등등, 하단에서 적절한 영역으로 설정하세요',
  })
  @IsString()
  @IsOptional()
  venueCategory!: VenueCategory;

  @ApiProperty({
    example: {
      ko: '여의도의 유명한 콩국수 전문점',
      en: 'famous place of soy-bean milk based noodle ',
    },
    description: '언어별 장소의 묘사',
  })
  @IsObject()
  description!: I18nText;

  @ApiProperty({
    example: 'KR',
    description: '거주 국가명의 영문명(KR, UK, USA등등)',
  })
  @IsString()
  country!: string;

  @ApiProperty({
    example: '서울특별시',
    description: '행정구역(서울특별시/부산광역시/경기도)',
  })
  @IsString()
  city!: string;

  @ApiProperty({
    example: '영등포구',
    description: '군/구',
  })
  @IsString()
  district!: string;

  @ApiProperty({
    example: '국제금융로6길 33 지하1층 ',
    description: '상세 주소(건물명, 호수등 상세주소)',
  })
  @IsString()
  details!: string;

  @ApiProperty({
    example: 37.5227,
    description: '사용자 위치(위도)',
  })
  @IsNumber()
  latitude!: number;

  @ApiProperty({
    example: 126.927,
    description: '사용자 위치(경도)',
  })
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional({
    example: 126.927,
    description: '사용자 위치(경도)',
  })
  @IsString()
  @IsOptional()
  googlePlaceId?: string;

  @ApiPropertyOptional({
    example: [
      'https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg',
    ],
    description: '장소의 이미지를 등록해주세요',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  venueImage?: string[];

  @ApiPropertyOptional({
    example: '597467',
    description: '한국관광공사 TourApi Id(가덕도 횟집)',
  })
  @IsOptional()
  @IsString()
  tourApiContentId?: string;
}
