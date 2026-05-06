"use client"

import { usePathname, useRouter } from "@/i18n/routing"
import { useAuthStore } from "@/store/auth-store"
import { useLocale } from "next-intl"
import { useEffect } from "react"

//사용자 정보의 Language를 locale에 반영 
export function LocalSync() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { user, hydrated } = useAuthStore()

  useEffect(() => {
    if (!hydrated) return
    if (!user?.language) return
    if (user.language === locale) return

    router.replace(pathname, { locale: user.language })
  }, [hydrated, user?.language, locale, pathname, router])

  return null
}
