import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { I18nText, Language, VenueCategory } from "../../common/types"
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class VenueUpdateDtoUser {
  @ApiPropertyOptional({
    example: { ko: "진주집", en: "JinjuJip" },
    description: "언어별 장소이름",
    enum: ["ko", "en", "ja", "zh", "es", "fr", "de"],
  })
  @IsString()
  @IsIn(["ko", "en", "ja", "zh", "es", "fr", "de"])
  name?: I18nText

  @ApiProperty({
    example: [
      "https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg",
    ],
    description: "장소의 이미지를 등록해주세요",
    type: [String],
  })
  venueImage?: string[]
}
