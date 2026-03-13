import { ApiProperty } from "@nestjs/swagger";
import { ReviewCreateDto } from "./reviewcreate.dto";
import { ReviewDetailCreateDto } from "../reviewdetail/reviewdetailcreate.dto";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ReviewCreateWithDetailDto extends ReviewCreateDto{
    @ApiProperty({
        type: ReviewDetailCreateDto,
        description: "리뷰 상세정보 추가"
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ReviewDetailCreateDto)
    reviewDetail! : ReviewDetailCreateDto

}