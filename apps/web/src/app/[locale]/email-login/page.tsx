"use client"

import { Link } from "@/i18n/routing"
import { authApi } from "@/lib/api/auth.api"
import { useAuthStore } from "@/store/auth-store"
import { IAuthResponse } from "@/types/auth"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EmailLoginPage() {
  const tr = useTranslations("EmailLoginPage")
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response: IAuthResponse = await authApi.login(formData)
      console.log(response)
      localStorage.setItem("accessToken", response.accessToken)
      setUser(response.user)

      router.replace(`/${response.user?.language}`)
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
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {tr("email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder={tr("emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {tr("password")}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder={tr("passwordPlaceholder")}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? tr("loading") : tr("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
