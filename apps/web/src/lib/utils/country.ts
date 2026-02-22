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
  if (initialized) return
  initialized = true
  countries.registerLocale(ko)
  countries.registerLocale(en)
  countries.registerLocale(ja)
  countries.registerLocale(zh)
  countries.registerLocale(es)
  countries.registerLocale(fr)
  countries.registerLocale(de)
}
//국가명 변환
export function localeCountryName(
  countryCode: string,
  lang: string = "ko",
): string {
  init()
  const countryName = countries.getName(countryCode, lang)
  if (!countryName) {
    console.error("해당하는 국가 이름이 없습니다")
    throw new Error(`Invalid Country Code: ${countryCode}`)
  }
  return countryName
}

//i18n-iso-countries의 국가명단 반환
export function getAllCountries(lang: string = "ko") {
  init()
  const names = countries.getNames(lang, { select: "official" })
  return Object.entries(names)
    .map(([code, name]) => ({
      code,
      name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

  // "ko-KR" -> "ko"등의 조건을 고려
export function toCountryLang(locale: string) {
  return locale.split("-")[0]
}
