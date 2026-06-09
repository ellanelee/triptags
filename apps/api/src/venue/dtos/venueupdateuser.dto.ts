import { ApiPropertyOptional } from '@nestjs/swagger';
import { I18nText } from '@triptags/shared';

import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class VenueUpdateDtoUser {
  @ApiPropertyOptional({
    example: { ko: '진주집', en: 'JinjuJip' },
    description: '언어별 장소이름',
  })
  @IsOptional()
  @IsObject()
  name?: I18nText;

  @ApiPropertyOptional({
    example: { ko: '서울 여의도에 위치한 콩국수 분점이에요.' },
    description: '언어별 장소설명',
  })
  @IsOptional()
  @IsObject()
  description?: I18nText;

  @ApiPropertyOptional({
    example: [
      'https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg',
    ],
    description: '장소의 이미지를 등록해주세요',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  venueImage?: string[];
}
