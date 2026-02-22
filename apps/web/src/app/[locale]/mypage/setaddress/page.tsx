"use client"

import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import * as countryAll from "i18n-iso-countries"
import { getAllCountries, toCountryLang } from "@/lib/utils/country"

export default function SetAddress() {
  const tr = useTranslations("Address")
  const t = useTranslations("Common")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [data, setData] = useState({
    country: "",
    city: "",
    district: "",
    details: "",
  })

  const countryList = getAllCountries(toCountryLang(locale))
  const fullAddress =
    [data.country, data.city, data.district, data.details]
      .map((v) => v.trim())
      .filter(Boolean)
      .join(" ") || ""

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/login`)
    }
  }, [isAuthenticated, user, locale, router])

  useEffect(() => {
    const fetchCountries = async () => {
      if (!isAuthenticated) return
    }
  }, [])

  const handleSubmitRegion = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
    } catch (error) {
    } finally {
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← {t("transaction.back") ?? "뒤로가기"}
          </button>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {tr("setAddressTitle") ?? "주소 설정"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {tr("addressHelp") ??
              "국가/도시/구·군/상세주소를 입력하면 주소가 저장됩니다."}
          </p>
        </div>

        {/* 폼 카드 */}
        <form
          onSubmit={handleSubmitRegion}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {/* 미리보기 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {tr("addressPreview") ?? "주소 미리보기"}
              </p>
              <button
                type="button"
                onClick={() =>
                  setData({
                    country: "",
                    city: "",
                    district: "",
                    details: "",
                  })
                }
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                {t("transaction.reset") ?? "초기화"}
              </button>
            </div>

            <div className="mt-2 rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
              {fullAddress ||
                (tr("addressEmpty") ?? "아직 입력된 주소가 없어요.")}
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 gap-4">
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {tr("countryLabel") ?? tr("country") ?? "국가"}
              </label>
              <select
                id="country"
                name="country"
                value={data.country}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    country: e.target.value,
                    city: "",
                    district: "",
                  }))
                }
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">{tr("selectCountry")}</option>
                {countryList.map((el) => (
                  <option key={el.code} value={el.code}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {tr("cityLabel") ?? tr("city") ?? "시/도"}
              </label>
              <input
                id="city"
                name="city"
                value={data.city}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder={tr("cityPlaceholder") ?? "예: 서울특별시"}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {tr("districtLabel") ?? tr("district") ?? "구/군"}
              </label>
              <input
                id="district"
                name="district"
                value={data.district}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, district: e.target.value }))
                }
                placeholder={tr("districtPlaceholder") ?? "예: 강남구"}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Details */}
            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {tr("detailsLabel") ?? tr("details") ?? "상세주소"}
              </label>
              <textarea
                id="details"
                name="details"
                rows={3}
                value={data.details}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, details: e.target.value }))
                }
                placeholder={
                  tr("detailsPlaceholder") ?? "예: 테헤란로 123, 101동 1001호"
                }
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/mypage`)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              {t("transaction.cancel") ?? "취소"}
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!data.country || !data.city || !data.district}
              title={
                !data.country || !data.city || !data.district
                  ? (tr("addressRequired") ??
                    "국가/시도/구군은 필수 입력입니다.")
                  : undefined
              }
            >
              {t("transaction.save") ?? "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
