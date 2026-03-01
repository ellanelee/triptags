import * as countries from "i18n-iso-countries"
import ko from "i18n-iso-countries/langs/ko.json"
import en from "i18n-iso-countries/langs/en.json"
import ja from "i18n-iso-countries/langs/ja.json"
import zh from "i18n-iso-countries/langs/zh.json"
import es from "i18n-iso-countries/langs/es.json"
import fr from "i18n-iso-countries/langs/fr.json"
import de from "i18n-iso-countries/langs/de.json"

let initialized = false

function init() {
  initialized = true

  countries.registerLocale(ko)
  countries.registerLocale(en)
  countries.registerLocale(ja)
  countries.registerLocale(zh)
  countries.registerLocale(es)
  countries.registerLocale(fr)
  countries.registerLocale(de)
}

export const CountryUtils = {
  // ISO 3166-1 alpha-2를 이용한 국가 코드검증
  isValidCountryCode(countryCode: string): boolean {
    init()
    return countries.isValid(countryCode)
  },

  //국가명 변환
  getCountryName(countryCode: string, lang: string = "ko"): string {
    init()
    const countryName = countries.getName(countryCode, lang)
    if (!countryName) {
      console.error("해당하는 국가 이름이 없습니다")
      throw new Error(`Invalid Country Code: ${countryCode}`)
    }
    return countryName
  },

  //프론트엔드 국가 List (드롭다운))
  selectCountryOption(lang: string = "ko") {
    init()
    const countryNames = countries.getNames(lang)
    return Object.entries(countryNames).map(([code, name]) => ({
      value: code,
      lable: name,
    }))
  },
}
