import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

//LocaleConfig가져오는 함수
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
  }
})
