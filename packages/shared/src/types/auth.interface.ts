import { Language } from "src/common/types"

export interface IRegisterInput {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  language: Language
}

export interface ILoginInput {
  email: string
  password: string
}
