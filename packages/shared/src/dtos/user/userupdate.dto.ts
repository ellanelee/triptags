import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from "class-validator"
import { Language } from "../../common/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class UserProfileUpdateDto {
  @ApiPropertyOptional({
    example: "사용자 주소",
    description: "profile",
  })
  @IsOptional()
  @IsString()
  detailedAddress?: string

  @ApiPropertyOptional({
    example: 37.32,
    description: "사용자",
  })
  @IsOptional()
  latitude?: number

  @ApiPropertyOptional({
    example: 132.32,
    description: "사용자",
  })
  @IsOptional()
  longitude?: number

  @ApiPropertyOptional({
    example: "사용자 소재",
    description: "저는 부산에 거주하는 홍길동이예요. 반가워요",
  })
  @IsString()
  introduction!: string | null
}

export class UserUpdateDto {
  @ApiPropertyOptional({
    example:
      "https://previews.123rf.com/images/breakingdots/breakingdots2304/breakingdots230400781/202938341-cat-kawaii-character-cartoon-vector-illustration.jpg",
    description: "유저프로필 이미지",
  })
  @IsOptional()
  profileImage?: string

  @ApiPropertyOptional({
    type: UserProfileUpdateDto,
    description: "profile details",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileUpdateDto)
  profile?: UserProfileUpdateDto
}
