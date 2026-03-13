import { ApiProperty } from "@nestjs/swagger"
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator"
import { VisitPurpose } from "../../common/types"
import { Type } from "class-transformer"

export class ReviewDetailCreateDto {
  @ApiProperty({
    example: 5,
    description: "장소에 대한 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  tasteRating!: number

  @ApiProperty({
    example: 5,
    description: "장소에 대한 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  serviceRating!: number

  @ApiProperty({
    example: 5,
    description: "장소에 대한 선호도 점수평가 (1~5)",
  })
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  priceRating!: number

  @ApiProperty({
    example: "가족여행",
    description: "방문하게 된 동기",
  })
  @IsNotEmpty()
  @IsString()
  visitPurpose!: VisitPurpose

  @ApiProperty({
    example: "2026-3-1",
    description: "Venue방문일자",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  visitDate?: Date
}
