import { localeConfig } from "@/i18n/localeConfig"
import type { RegisterDto } from "@triptags/shared"

export type LocaleConfigType = {
  requireTerms: boolean
  requirePrivacy: boolean
  requireAge: boolean
  showMarketing: boolean
  minAge: number
  marketingOptIn: boolean
  legalBasis: string
}

export type RegionType = {
  country: string
  city: string
  district: string
}

