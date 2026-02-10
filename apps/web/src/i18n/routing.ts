import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

//언어 설정 : locale 범위 및 default설정  
export const routing = defineRouting({
  locales: ["ko", "en", "ja", "zh", "es", "fr", "de"],
  defaultLocale: "ko",
  localePrefix: "always",
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
