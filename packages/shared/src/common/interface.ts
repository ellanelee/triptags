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

interface GeoProvider {
  geocode(addressText: string, countryCode?: string): Promise<{ lat: number; lng: number; formattedAddress?: string }>;
  reverseGeocode(lat: number, lng: number): Promise<{ countryCode?: string; regionText?: string; formattedAddress?: string }>;
}