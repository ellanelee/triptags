"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const tr = useTranslations("LoginPage")
  const router = useRouter()

  const handleSocialLogin = (provider: string) => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
    window.location.href = `${apiUrl}/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-8 gap-8">
        <div className="col-start-3 col-span-4">
          <div className="bg-white rounded-2xl shadow-xl py-16 px-20">
            <div className="mb-10">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <span className="mr-2">←</span>
                {tr("backToHome")}
              </Link>
              <h2 className="text-center text-3xl font-bold text-gray-900 mt-3">
                {tr("title")}
              </h2>
            </div>

            <div className="space-y-6">
              {/* 구글 로그인 */}
              <button
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg text-base font-semibold transition-all hover:bg-gray-50 border-2 border-gray-300"
                style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {tr("googleLogin")}
              </button>

              {/* 카카오 로그인 */}
              <button
                onClick={() => handleSocialLogin("kakao")}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg text-base font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: "#FEE500", color: "#000000" }}
              >
                <span className="text-xl">💬</span>
                {tr("kakaoLogin")}
              </button>

              {/* 네이버 로그인 */}
              <button
                onClick={() => handleSocialLogin("naver")}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg text-base font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: "#03C75A", color: "#FFFFFF" }}
              >
                <span className="text-xl font-bold">N</span>
                {tr("naverLogin")}
              </button>
            </div>

            {/* 구분선 */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {tr("orDivider")}
                </span>
              </div>
            </div>

            {/* 이메일 로그인 링크 */}
            <div className="space-y-4">
              <Link
                href="/email-login"
                className="block w-full text-center py-3 px-6 border border-gray-300 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {tr("emailLogin")}
              </Link>

              {/* 회원가입 안내 */}
              <div className="text-center text-sm text-gray-600 mt-8 mb-2">
                {tr("noAccount")}{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  {tr("registerLink")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
