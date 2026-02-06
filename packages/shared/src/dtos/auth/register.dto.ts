import { IsEmail, IsString, IsStrongPassword } from "class-validator"
import { Language } from "../../common/types"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "사용자 이메일 주소",
    required: true,
  })
  @IsEmail({}, { message: "이메일 형식을 지켜주세요" })
  email!: string

  @ApiProperty({
    example: "User1234!",
    description: "로그인 패스워드(영문대소문자,숫자,특수문자포함 8자 이상",
    required: true,
  })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: "비밀번호는 영문대소문자,숫자,특수문자 반드시 포함, 8자 이상" },
  )
  password!: string

  @ApiProperty({
    example: "User1234!",
    description:
      "로그인 패스워드 재확인(영문대소문자,숫자,특수문자포함 8자 이상",
    required: true,
  })
  @IsString()
  passwordConfirm!: string

  @ApiProperty({
    example: "홍길동",
    description:
      "로그인 패스워드 재확인(영문대소문자,숫자,특수문자포함 8자 이상",
    required: true,
  })
  @IsString()
  nickname!: string

  @ApiProperty({
    example: "ko",
    description:
      "ko(korean),en(english),zh(chinese),es(spanish),ja(japanese),fr(french)ge(german)",
    required: true,
  })
  language!: Language
}
