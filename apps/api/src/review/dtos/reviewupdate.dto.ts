import { ApiProperty } from '@nestjs/swagger';
import { I18nText } from '@triptags/shared';
import { IsNotEmpty } from 'class-validator';

export class ReviewUpdateDto {
  @ApiProperty({
    example: { en: 'Nice, But need waiting more than 1hour.' },
    description:
      '장소에 대한 선호도 평가, 언어는 ko/en/ja/zh/es/fr/de중에 선택',
  })
  @IsNotEmpty()
  contents!: I18nText;
}
