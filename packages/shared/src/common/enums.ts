export interface LanguageOptions {
  main: string
  lang: Language
}

export enum Language {
  KO = "ko",
  EN = "en",
  JA = "ja",
  ZH = "zh",
  ES = "es",
  FR = "fr",
  DE = "de",
}

export enum Provider {
  "GOOGLE",
  "KAKAO",
  "NAVER",
  "LOCAL",
}
