import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsStrongPassword } from "class-validator"

export class UpdatePasswordDto {
  @ApiProperty({
    example: "1234Abcd!",
    description:
      "패스워드 변경을 위한 기존 패스워드 확인(영문대소문자,숫자,특수문자포함 8자 이상",
    required: true,
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: "비밀번호는 영문대소문자,숫자,특수문자 반드시 포함, 8자 이상" }
  )
  @IsString()
  prevPassword!: string

  @ApiProperty({
    example: "1234Abcd!",
    description: "변경하고자 하는 패스워드 입력",
    required: true,
  })
  @IsString()
  newPassword!: string
}
