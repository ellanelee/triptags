import { ApiPropertyOptional } from "@nestjs/swagger"
import { VenueCategory } from "@triptags/database"
import { Type } from "class-transformer"
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator"
import { SortBy } from "src/types/venue.interface"

export class VenuePaginationDto {
  @ApiPropertyOptional({ example: 1, description: "페이지 number" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ example: 10, description: "페이지당 item갯수" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  items?: number = 10

  @ApiPropertyOptional({
    example: "CAFE",
    description: "CAFE/RESTAURANT등",
  })
  @IsOptional()
  @IsString()
  category?: VenueCategory

  @ApiPropertyOptional({ description: "검색어" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: "국가" })
  @IsOptional()
  @IsString()
  country?: string

  @ApiPropertyOptional({ description: "도시(시/도)" })
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional({ description: "시/구/군" })
  @IsOptional()
  @IsString()
  district?: string

  @ApiPropertyOptional({ description: "최소 평점", example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9)
  rating?: number

  @ApiPropertyOptional({ description: "정렬 기준" })
  @IsOptional()
  @IsString()
  sortBy?: SortBy
}
