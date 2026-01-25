import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { I18nText } from "../../common/types"

export class VenueCreateDetailDto {
  @ApiProperty({
    example: "010123445678",
    description: "업장의 전화번호를 등록해주세요",
  })
  @IsString()
  phoneNumber?: string

  @ApiProperty({
    example: "20000-50000",
    description: "최대와 최소가격대를 등록해주세요",
  })
  @IsString()
  priceRange?: string

  @ApiProperty({
    example: "한식",
    description: "주어진 카테고리내에서 특화된 내용을 넣어주세요",
  })
  @IsString()
  subCategory?: string

  @ApiProperty({
    example: "www.naver.com",
    description: "venue의 website가 있다면 넣어주세요",
  })
  @IsString()
  websiteUrl?: string

  @ApiProperty({
    example: "{ko: 월~토 9:00 ~ 20:00, 일요일 휴무, 설/추석연휴 휴무}",
    description: "주어진 카테고리내에서 특화된 내용을 넣어주세요",
  })
  workHour?: I18nText
}
