import { ApiProperty } from "@nestjs/swagger"
import { IsIn } from "class-validator"
import { Language } from "src/common/types"

const LANGUAGES: Language[] = ["ko", "en", "ja", "zh", "es", "fr", "de"]

export class LanguageDto {
  @ApiProperty({
    example: "ko",
    description:
      "ko(korean),en(english),zh(chinese),es(spanish),ja(japanese),fr(french)ge(german)",
    required: true,
  })
  @IsIn(LANGUAGES, { message: "지원하지 않는 language입니다" })
  language!: Language
}
