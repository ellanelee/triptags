import { ApiProperty } from "@nestjs/swagger"
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from "class-validator"

export class ReviewDetailCreateDto {
  @ApiProperty({
    example: 5,
    description: "맛 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  tasteRating!: number

  @ApiProperty({
    example: 5,
    description: "서비스 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  ServiceRating!: number

  @ApiProperty({
    example: 5,
    description: "가격 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  PriceRating!: number

  @ApiProperty({
    example: "2026-02-09",
    description: "방문 일자 형식을 yyyy-mm-dd로 입력해주세요",
  })
  @IsDateString({}, { message: "날짜 형식이 바르지 않습니다. YYYY-MM-DD" })
  visitDate?: Date

  @ApiProperty({
    example: "독서",
    description: "방문 목적",
  })
  @IsNotEmpty()
  @IsString()
  visitPurpose!: string
}
