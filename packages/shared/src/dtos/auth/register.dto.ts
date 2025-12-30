import { IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator"
import { Language } from "../../common/enums"
import { Match } from "../../utils/match.decorator"

export class RegisterDto {
  @IsEmail({}, { message: "이메일 형식을 지켜주세요" })
  email!: string

  @IsString()
  passwordConfirm!: string

  @IsString()
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
  password!: string

  @IsString()
  nickname!: string

  @IsEnum(Language)
  language!: Language
}
