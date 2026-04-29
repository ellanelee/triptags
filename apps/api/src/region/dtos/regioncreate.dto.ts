import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegionCreateDto {
  @ApiProperty({
    example: 'KR',
    description: '검색하고자 하는 국가',
  })
  @IsString()
  country!: string;

  @ApiProperty({
    example: '경주시',
    description: '검색하고자 하는 도/특별시/광역시',
  })
  @IsString()
  city!: string;

  @ApiProperty({
    example: '영등포구',
    description: '검색하고자 하는 시/군/구',
  })
  @IsString()
  district!: string;
}
