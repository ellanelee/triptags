import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"
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
    example: "{'ko':음식이 맛있지만 줄을 많이 서야해요.}",
    description:
      "장소에 대한 선호도 평가, 언어는 ko/en/ja/zh/es/fr/de중에 선택",
  })
  contents?: I18nText
}
