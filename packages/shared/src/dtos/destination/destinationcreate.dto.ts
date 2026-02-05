import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString, Max, Min } from "class-validator"

export class DestinationCreateDto {
  @ApiProperty({
    example: "KR",
    description: "국가코드(ISO 3166-1 alpha-2, KR/US등으로 입력",
  })
  country!: String

  @ApiProperty({
    example: "경상북도",
    description: "여행하고 싶은 지역(도,특별시/광역시) 입력",
  })
  @IsString()
  city!: string

  @ApiProperty({
    example: "경주",
    description: "여행하고 지역(시/군/구)",
  })
  district!: string

  @ApiProperty({
    example: 0,
    description: "여행 선호도 0~9",
  })
  @Min(0)
  @Max(9)
  @IsInt()
  priority!: number
}
