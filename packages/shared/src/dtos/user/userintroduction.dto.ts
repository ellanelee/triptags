import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UserIntroductionDto {
  @ApiProperty({
    example: "사용자 소재",
    description: "저는 부산에 거주하는 홍길동이예요. 반가워요",
  })
  @IsString()
  introduction!: string
}
