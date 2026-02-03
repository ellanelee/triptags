import * as countries from "i18n-iso-countries"
import ko from "i18n-iso-countries/langs/ko.json"
import en from "i18n-iso-countries/langs/en.json"
import ja from "i18n-iso-countries/langs/en.json"
import zh from "i18n-iso-countries/langs/en.json"
import es from "i18n-iso-countries/langs/en.json"
import fr from "i18n-iso-countries/langs/en.json"
import de from "i18n-iso-countries/langs/en.json"

countries.registerLocale(ko)
countries.registerLocale(en)
countries.registerLocale(ja)
countries.registerLocale(zh)
countries.registerLocale(es)
countries.registerLocale(fr)
countries.registerLocale(de)

export const LocationUtils = {
  // ISO 3166-1 alpha-2를 이용한 국가 코드검증
  isValidCountryCode(countryCode: string): boolean {
    return countries.isValid(countryCode)
  },

  //국가명 변환
  getCountryName(countryCode: string, lang: string = "ko"): string {
    const countryName = countries.getName(countryCode, lang)
    if (!countryName) {
      console.error("해당하는 국가 이름이 없습니다")
      throw new Error(`Invalid Country Code: ${countryCode}`)
    }
    return countryName
  },

  //프론트엔드 국가 List (드롭다운))
  selectCountryOption(lang: string = "ko") {
    const countryNames = countries.getNames(lang)
    return Object.entries(countryNames).map(([code, name]) => ({
      value: code,
      lable: name,
    }))
  },
}
