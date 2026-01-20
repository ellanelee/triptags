import { ApiProperty } from "@nestjs/swagger"
import { Language, VenueCategory } from "../../common/types"
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class VenueUpdateDtoUser {
  @ApiProperty({
    example: "ko",
    description: "언어코드",
    enum: ["ko", "en", "ja", "zh", "es", "fr", "de"],
  })
  @IsString()
  @IsIn(["ko", "en", "ja", "zh", "es", "fr", "de"])
  language?: Language

  @ApiProperty({
    example: "진주집",
    description: "장소의 이름",
  })
  name?: string

  @ApiProperty({
    example: {
      1: "https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg",
    },
    description: "장소의 이미지를 등록해주세요",
    type: [String],
  })
  venueImage?: string[]
}
