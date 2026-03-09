"use client"

import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname, useRouter as useI18nRouter } from "@/i18n/routing"
import { useState, useEffect, useRef } from "react"
import { useAuthStore } from "@/store/auth-store"

const languages = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
]

export function Header() {
  const t = useTranslations("Navbar")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useI18nRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false)
      }
    }

    if (isLangMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLangMenuOpen])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any })
    setIsLangMenuOpen(false)
  }

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0]
  const isTransparentNav = pathname === "/" && !isAuthenticated

  if (pathname.includes("/login") || pathname.includes("/register")) {
    return null
  }

  return (
    <header
      className={`${isTransparentNav ? "bg-transparent absolute top-0 left-0 right-0 z-50" : "bg-white shadow"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span
                className={`text-2xl font-bold ${isTransparentNav ? "text-white drop-shadow-lg" : "text-primary-600"}`}
              >
                TripTags
              </span>
            </Link>
          </div>

          {/* Right Section: Language & Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-md ${
                  isTransparentNav
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Language Dropdown */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                        locale === lang.code
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {locale === lang.code && (
                        <svg
                          className="w-4 h-4 ml-auto text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Profile Image */}
                <Link
                  href="/mypage"
                  className="flex items-center"
                  style={{ marginLeft: "13px", marginRight: "15px" }}
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.nickname || "Profile"}
                      className="w-[35px] h-[35px] rounded-full object-cover border border-gray-200 hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div
                      className={`w-[35px] h-[35px] rounded-full flex items-center justify-center text-sm font-bold border border-gray-200 hover:scale-110 transition-transform ${
                        isTransparentNav
                          ? "bg-white/20 text-white"
                          : "bg-primary-100 text-primary-600"
                      }`}
                    >
                      {user?.nickname?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-sm ${
                    isTransparentNav
                      ? 'text-white hover:text-white/80'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm ${
                    isTransparentNav
                      ? "text-white hover:text-white/80"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    isTransparentNav
                      ? "border-white text-white hover:bg-white/10"
                      : "border-transparent text-white bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navbar */}
      {!isTransparentNav && (
        <nav className="bg-gray-50 py-2 hover:py-5 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8">
              <Link
                href="/venues"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                {t("venues")}
              </Link>
              {isAuthenticated && (
                <Link
                  href="/venues/new"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  {t("addVenue")}
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
