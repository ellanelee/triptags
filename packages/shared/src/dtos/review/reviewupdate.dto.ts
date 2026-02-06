import { ApiProperty } from "@nestjs/swagger"
import { IsInt, Max, Min } from "class-validator"
import { I18nText } from "../../common/types"

export class ReviewUpdateDto {
  @ApiProperty({
    example: 5,
    description: "장소에 대한 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsInt()
  rating?: number

  @ApiProperty({
    example: { en: "Nice, But need waiting more than 1hour." },
    description:
      "장소에 대한 선호도 평가, 언어는 ko/en/ja/zh/es/fr/de중에 선택",
  })
  contents?: I18nText
}
