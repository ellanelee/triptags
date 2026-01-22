import { ApiProperty } from "@nestjs/swagger"
import { I18nText, Language, VenueCategory } from "../../common/types"
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class VenueCreateDto {
  @ApiProperty({
    example: "ko",
    description: "언어코드",
    enum: ["ko", "en", "ja", "zh", "es", "fr", "de"],
  })
  @IsString()
  @IsIn(["ko", "en", "ja", "zh", "es", "fr", "de"])
  language!: Language

  @ApiProperty({
    example: "진주집",
    description: "장소의 이름",
  })
  name!: string

  @ApiProperty({
    example: "RESTAURANT",
    description:
      "RESTAURANT(식당), CAFE(카페), HOTEL(호텔), STREET_FOOD(거리음식), BAR(바),SHOPPING(쇼핑), CULTURE(문화) 등등, 하단에서 적절한 영역으로 설정하세요",
  })
  venueCategory?: VenueCategory

  @ApiProperty({
    example: "여의도의 유명한 콩국수 전문점, 줄서는 집",
    description: "설명을 작성하세요",
  })
  description?: string

  @ApiProperty({
    example: "KR",
    description: "거주 국가명의 영문명(KR, UK, USA등등)",
  })
  @IsString()
  @IsNotEmpty()
  country!: string

  @ApiProperty({
    example: "서울특별시",
    description: "행정구역(서울특별시/부산광역시/경기도)",
  })
  @IsString()
  @IsNotEmpty()
  city!: string

  @ApiProperty({
    example: "영등포구",
    description: "군/구",
  })
  @IsString()
  @IsNotEmpty()
  district!: string

  @ApiProperty({
    example: "국제금융로6길 33 지하1층 ",
    description: "상세 주소(건물명, 호수등 상세주소)",
  })
  @IsString()
  @IsNotEmpty()
  details!: string

  @ApiProperty({
    example: 37.5227,
    description: "사용자 위치(위도)",
  })
  @IsNumber()
  @IsNotEmpty()
  latitude!: number

  @ApiProperty({
    example: 126.927,
    description: "사용자 위치(경도)",
  })
  @IsNumber()
  @IsNotEmpty()
  longitude!: number

  @ApiProperty({
    example: 126.927,
    description: "사용자 위치(경도)",
  })
  @IsNumber()
  @IsNotEmpty()
  googlePlaceId?: string

  @ApiProperty({
    example: {
      1: "https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg",
    },
    description: "장소의 이미지를 등록해주세요",
    type: [String],
  })
  venueImage?: string[]
}
