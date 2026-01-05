import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class UpdateNicknameDto {
  @ApiProperty({
    description: "변경할 새로운 닉네임",
    example: "홍길동",
  })
  @IsString()
  @MinLength(2)
  nickname!: string
}
