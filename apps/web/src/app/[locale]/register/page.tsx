"use client"
import { authApi } from "@/lib/api/auth.api"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { RegisterDto } from "@triptags/shared"
import { Link } from "@/i18n/routing"

export default function RegisterPage() {
  const tr = useTranslations("RegisterPage")
  const locale = useLocale()
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    language: "ko",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modealType, setModalType] = useState<"success" | "error">("success")

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

                <div>
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
                </div>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
