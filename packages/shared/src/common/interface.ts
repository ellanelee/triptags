import { Language } from "./types"

export interface LanguageOptions {
  main: string
  lang: Language
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
