import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UserProfileImageDto {
  @ApiProperty({
    example:
      "https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg",
    description: "유저프로필 이미지 등록",
  })
  @IsString()
  profileImageUrl!: string
}
