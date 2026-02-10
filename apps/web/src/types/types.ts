import { localeConfig } from "@/i18n/localeConfig"


export type LocaleConfigType = {
  requireTerms: boolean
  requirePrivacy: boolean
  requireAge: boolean
  showMarketing: boolean
  minAge: number
  marketingOptIn: boolean
  legalBasis: string
}
