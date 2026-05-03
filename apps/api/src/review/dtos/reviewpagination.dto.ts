import { ApiPropertyOptional } from '@nestjs/swagger';
import { IReviewPaginationInput } from '@triptags/shared';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ReviewPaginationDto implements IReviewPaginationInput {
  @ApiPropertyOptional({ example: 1, description: '페이지 number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: '페이지당 item갯수' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  items?: number = 10;
}
