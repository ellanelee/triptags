import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class UserAddressDto {
  @ApiProperty({
    example: "대한민국",
    description: "거주 국가명",
  })
  @IsString()
  @IsNotEmpty()
  country!: string

  @ApiProperty({
    example: "서울시",
    description: "도시명",
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
