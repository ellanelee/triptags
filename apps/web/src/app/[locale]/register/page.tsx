"use client"
import { authApi } from "@/lib/api/auth.api"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { RegisterDto } from "@triptags/shared"
import { Link } from "@/i18n/routing"
import { getLocaleConfig } from "@/i18n/localeConfig"
import { LanguageSelect } from "@/components/common/LanguageSelect"

export default function RegisterPage() {
  const tr = useTranslations("RegisterPage")
  const t = useTranslations("Common")
  const locale = useLocale()
  const localeConfig = getLocaleConfig(locale)
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    language: "ko",
  })
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modealType, setModalType] = useState<"success" | "error">("success")

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      age: checked,
      marketing: checked,
    })
  }

  const handleAgreement = (
    key: "terms" | "privacy" | "age" | "marketing",
    checked: boolean,
  ) => {
    const newAgreements = { ...agreements, [key]: checked }
    // 전부 체크되었는지 확인
    const allChecked =
      newAgreements.terms &&
      newAgreements.privacy &&
      newAgreements.age &&
      newAgreements.marketing
    newAgreements.all = allChecked
    setAgreements(newAgreements)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authApi.register(formData)
      if (response.success) {
        setSuccessMessage(response.message || "회원가입완료")
        setTimeout(() => {
          router.replace(`/${locale}`)
        }, 1000)
      }
    } catch (error) {
      const axiosError = error as any
      const errorMsg = (axiosError.response?.data?.message ||
        tr(axiosError)) as any
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-8 gap-8">
        <div className="col-start-3 col-span-4">
          <div className="bg-white rounded-2xl shadow-xl py-12 px-20">
            <div className="mb-8">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <span className="mr-2">←</span>
                {tr("backToLogin")}
              </Link>
              <h2 className="text-center text-3xl font-bold text-gray-900 mt-8">
                {tr("title")}
              </h2>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {tr("email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm h-9"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {tr("nickname")}
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm h-9"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {tr("password")}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm h-9"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="passwordConfirm"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {tr("passwordConfirm")}
                  </label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm h-9"
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passwordConfirm: e.target.value,
                      })
                    }
                  />
                </div>

                <LanguageSelect
                  label={tr("language")}
                  value={formData.language}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      language: val as RegisterDto["language"],
                    })
                  }
                  tr={t}
                />

                {/* <div>
                  <label
                    htmlFor="languageSelection"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {tr("language")}
                  </label>
                  <select
                    id="language"
                    name="language"
                    autoComplete="language"
                    required
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm h-9"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value as RegisterDto["language"],
                      })
                    }
                  >
                    <option value="ko">{tr("languages.ko")}</option>
                    <option value="en">{tr("languages.en")}</option>
                    <option value="ja">{tr("languages.ja")}</option>
                    <option value="zh">{tr("languages.zh")}</option>
                    <option value="de">{tr("languages.de")}</option>
                    <option value="es">{tr("languages.es")}</option>
                    <option value="fr">{tr("languages.fr")}</option>
                  </select>
                </div> */}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? tr("loading") : tr("submit")}
                  </button>
                </div>
              </div>
              {/* 약관 동의 섹션 - locale별로 표시 여부와 필수 여부가 다름 */}
              {(localeConfig.requireTerms ||
                localeConfig.requirePrivacy ||
                localeConfig.requireAge ||
                localeConfig.showMarketing) && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      id="agreeAll"
                      type="checkbox"
                      checked={agreements.all}
                      onChange={(e) => handleAllAgreement(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label
                      htmlFor="agreeAll"
                      className="ml-3 text-base font-semibold text-gray-900 cursor-pointer"
                    >
                      {tr("agreeAll")}
                    </label>
                  </div>
                  <div className="pl-8 space-y-3">
                    {/* 이용약관 동의 */}
                    <div className="flex items-center">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        checked={agreements.terms}
                        onChange={(e) =>
                          handleAgreement("terms", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <label
                        htmlFor="agreeTerms"
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {tr("agreeTerms")}{" "}
                        <span
                          className={
                            localeConfig.requireTerms
                              ? "text-primary-600"
                              : "text-gray-500"
                          }
                        >
                          {localeConfig.requireTerms
                            ? tr("required")
                            : tr("optional")}
                        </span>
                      </label>
                    </div>

                    {/* 개인정보 처리방침 동의 */}
                    <div className="flex items-center">
                      <input
                        id="agreePrivacy"
                        type="checkbox"
                        checked={agreements.privacy}
                        onChange={(e) =>
                          handleAgreement("privacy", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <label
                        htmlFor="agreePrivacy"
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {tr("agreePrivacy")}{" "}
                        <span
                          className={
                            localeConfig.requirePrivacy
                              ? "text-primary-600"
                              : "text-gray-500"
                          }
                        >
                          {localeConfig.requirePrivacy
                            ? tr("required")
                            : tr("optional")}
                        </span>
                      </label>
                    </div>

                    {/* 연령 확인 - locale별로 표시 여부 다름 */}
                    <div className="flex items-center">
                      <input
                        id="agreeAge"
                        type="checkbox"
                        checked={agreements.age}
                        onChange={(e) =>
                          handleAgreement("age", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <label
                        htmlFor="agreeAge"
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {tr("agreeAge")}{" "}
                        <span
                          className={
                            localeConfig.requireAge
                              ? "text-primary-600"
                              : "text-gray-500"
                          }
                        >
                          {localeConfig.requireAge
                            ? tr("required")
                            : tr("optional")}
                        </span>
                      </label>
                    </div>

                    {/* 마케팅 정보 수신 동의 - Opt-in/Opt-out에 따라 다르게 표시 */}
                    {localeConfig.showMarketing && (
                      <div className="flex items-center">
                        <input
                          id="agreeMarketing"
                          type="checkbox"
                          checked={agreements.marketing}
                          onChange={(e) =>
                            handleAgreement("marketing", e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <label
                          htmlFor="agreeMarketing"
                          className="ml-3 text-sm text-gray-700 cursor-pointer"
                        >
                          {tr("agreeMarketing")}{" "}
                          <span className="text-gray-500">
                            {tr("optional")}
                            {localeConfig.marketingOptIn && (
                              <span className="ml-1 text-xs">(Opt-in)</span>
                            )}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
