import { ApiProperty } from '@nestjs/swagger';
import { Language, SUPPORTED_LANGUAGES } from '@triptags/shared';
import { IsIn } from 'class-validator';

export class LanguageDto {
  @ApiProperty({
    example: 'ko',
    description:
      'ko(korean),en(english),zh(chinese),es(spanish),ja(japanese),fr(french)ge(german)',
    required: true,
  })
  @IsIn(SUPPORTED_LANGUAGES, { message: '지원하지 않는 language입니다' })
  language!: Language;
}
