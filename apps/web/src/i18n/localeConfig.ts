import { LocaleConfigType } from "@/types/types"

// legal requirements ( 각국의 정보 보호법 준수 )
export const localeConfig = {
  // 한국 - 개인정보보호법 + 정보통신망법
  ko: {
    requireTerms: true, // 이용약관 필수
    requirePrivacy: true, // 개인정보 수집·이용 필수
    requireAge: true, // 만 14세 미만 법정대리인 동의 필요
    showMarketing: true, // 마케팅 동의 표시
    minAge: 14, // 법정 최소 연령
    marketingOptIn: true, // Opt-in 방식 (사용자가 직접 체크)
    legalBasis: "개인정보보호법, 정보통신망법",
  },
  // 🇯🇵 Japan - 개인정보 보호법
  ja: {
    requireTerms: true, // 이용약관 필수 (비즈니스 관행)
    requirePrivacy: true, // 개인정보 수집·이용 필수
    requireAge: false, // 법적 의무는 없으나 권장
    showMarketing: true, // 마케팅 동의 표시
    minAge: 18, // 일반적 관행
    marketingOptIn: true, // Opt-in 권장
    legalBasis: "個人情報保護法 (2022年改正)",
  },
  // 🇺🇸 United States - COPPA + State laws
  en: {
    requireTerms: false, // 이용약관 필수X (주법)
    requirePrivacy: false, // 개인정보보호 필수X
    requireAge: true, // COPPA: 13세 미만 부모 동의 필요
    showMarketing: true, // 마케팅 동의 표시
    minAge: 13, // COPPA 기준
    marketingOptIn: false, // Opt-out 방식 허용 (CAN-SPAM Act)
    legalBasis: "COPPA, CAN-SPAM Act, State laws (CCPA, etc.)",
  },
  // 🇨🇳 China - 个人信息保护法 (Very Strict, 2021)
  zh: {
    requireTerms: true, // 약관 (필수)
    requirePrivacy: true, // 개인정보 수집·이용 필수
    requireAge: true, // 14세 미만 부모 동의 필요
    showMarketing: true, // 마케팅 동의 표시
    minAge: 14, // 법정 최소 연령
    marketingOptIn: true, // Opt-in 방식
    legalBasis: "个人信息保护法 (PIPL, 2021)",
  },
  // 🇪🇸 Spain - GDPR + LOPDGDD (Very Strict)
  es: {
    requireTerms: true, // 약관 동의 필수
    requirePrivacy: true, // 개인정보 동의 필수
    requireAge: true, // 스페인은 14(GDPR보다 엄격)
    showMarketing: true, // 마케팅 동의 표시
    minAge: 14, // 스페인은 14세로 설정
    marketingOptIn: true, // GDPR: Opt-in 필수
    legalBasis: "GDPR, LOPDGDD",
  },
  // 🇫🇷 France - GDPR (Very Strict)
  fr: {
    requireTerms: true,
    requirePrivacy: true,
    requireAge: true, // GDPR: 16세 미만 부모 동의
    showMarketing: true, // 마케팅 동의 표시
    minAge: 16, // GDPR 일반 기본값
    marketingOptIn: true, // Opt-in 필수, 사전 체크 금지
    legalBasis: "GDPR (EU 2016/679)",
  },
  // 🇩🇪 Germany - GDPR + BDSG (Very Strict)
  de: {
    requireTerms: true, // GDPR: 명시적 동의 필수
    requirePrivacy: true, // GDPR: 개인정보 처리 동의 필수
    requireAge: true, // GDPR: 16세 미만 부모 동의
    showMarketing: true, // 마케팅 동의 표시
    minAge: 16, // GDPR 기본값
    marketingOptIn: true, // GDPR: Opt-in 필수
    legalBasis: "GDPR, BDSG (Bundesdatenschutzgesetz)",
  },
} as const

export type Locale = keyof typeof localeConfig

export function getLocaleConfig(locale: string): LocaleConfigType {
  return localeConfig[locale as Locale] || localeConfig.en
}

// 동의서 검증 
export function validateAgreements(
  agreements: {
    terms: boolean
    privacy: boolean
    age: boolean
    marketing: boolean
  },
  locale: string,
): { isValid: boolean; missingRequired: string[] } {
  const config = getLocaleConfig(locale)
  const missing: string[] = []

  if (config.requireTerms && !agreements.terms) {
    missing.push("terms")
  }
  if (config.requirePrivacy && !agreements.privacy) {
    missing.push("privacy")
  }
  if (config.requireAge && !agreements.age) {
    missing.push("age")
  }

  return {
    isValid: missing.length === 0,
    missingRequired: missing,
  }
}
