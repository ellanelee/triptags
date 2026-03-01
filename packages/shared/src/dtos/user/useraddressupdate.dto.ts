import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class UserAddressUpdateDto {
  @ApiProperty({
    example: "KR",
    description: "거주 국가명의 영문명, KR, UK, USA등등",
  })
  @IsString()
  @IsNotEmpty()
  country!: string

  @ApiProperty({
    example: "서울특별시",
    description: "도/특별시/광역시(특별시,광역시등의 명칭 반드시 표기",
  })
  @IsString()
  @IsNotEmpty()
  city!: string

  @ApiProperty({
    example: "강남구",
    description: "군/구",
  })
  @IsString()
  @IsNotEmpty()
  district!: string

  @ApiProperty({
    example: "테헤란로 1길 1 ",
    description: "상세 주소(건물명, 호수등 상세주소)",
  })
  @IsString()
  @IsNotEmpty()
  details!: string

  @ApiProperty({
    example: 37.32,
    description: "사용자 위치(위도)",
  })
  @IsNumber()
  @IsNotEmpty()
  latitude!: number

  @ApiProperty({
    example: 132.32,
    description: "사용자 위치(경도)",
  })
  @IsNumber()
  @IsNotEmpty()
  longitude!: number
}
