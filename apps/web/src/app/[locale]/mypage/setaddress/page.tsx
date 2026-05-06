"use client"

import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { regionApi } from "@/lib/api/region.api"
import { RegionInfo } from "@/types/types"
import { useAsync } from "@/lib/hooks/use.async"
import { userApi } from "@/lib/api/user.api"
import { CountryUtils } from "@/lib/utils/domain/country.utils"

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
  const [cities, setCities] = useState<RegionInfo[]>([])
  const [districts, setDistricts] = useState<RegionInfo[]>([])
  const countryList = CountryUtils.getAllCountries(
    CountryUtils.toCountryLang(locale),
  )
  const countryInfo = useAsync<string>("")
  const regionInfo = useAsync<RegionInfo[]>([])
  const fullAddress =
    [data.country, data.city, data.district, data.details].join(" ") || ""

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/login`)
    }
  }, [isAuthenticated, user, locale, router])

  const extractSub = async (parentId: string) => {
    return await regionInfo.run(() => regionApi.getSubRegion(parentId))
  }

  const handleCountryInfo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = countryList.find((el) => el.code === code)
    setData((prev) => ({
      ...prev,
      country: selected?.name ?? "",
      city: "",
      district: "",
    }))
    try {
      const countryId = await countryInfo.run(() =>
        regionApi.getCountryIdByCode(code),
      )
      if (!countryId) return
      const cities = await extractSub(countryId)
      setCities(cities)
    } catch (error) {
      console.error("데이터 수신에 실패하였습니다", error)
    }
  }

  const handleRegionInfo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!value) return
    if (name === "city") {
      const regionName = cities.find((el) => el.id === value)?.name || ""
      setData((prev) => ({
        ...prev,
        city: regionName,
        district: "",
      }))
      try {
        if (!value) return
        const regions = await extractSub(value)
        setDistricts(regions)
      } catch (error) {
        console.error("데이터 수신에 실패하였습니다", error)
      }
    } else if (name === "district") {
      const regionName = districts.find((el) => el.id === value)?.name || ""
      setData((prev) => ({
        ...prev,
        district: regionName,
      }))
    } else {
      console.error("데이터 설정에 오류발생")
    }
  }

  const handleSubmitRegion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.country || !data.city || !data.district || !data.details) {
      alert("세부 주소정보를 선택해주세요")
      return
    }
    try {
      const countryCode =
        countryList.find((el) => el.name === data.country)?.code || ""
      const submitData = {
        ...data,
        country: countryCode,
      }
      const response = await userApi.updateAddress(submitData)
      console.log(response, "주소 정보가 update되었습니다")
      router.push(`/${locale}/mypage`)
    } catch (error) {
      console.error("업데이트 진행에 오류가 있습니다.", error)
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
                value={
                  countryList.find((el) => el.name === data.country)?.code || ""
                }
                onChange={handleCountryInfo}
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
              <select
                id="city"
                name="city"
                value={cities.find((el) => el.name === data.city)?.id || ""}
                onChange={handleRegionInfo}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">{tr("cityLabel")}</option>
                {cities.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {tr("districtLabel") ?? tr("district") ?? "구/군"}
              </label>
              <select
                id="district"
                name="district"
                value={
                  districts.find((el) => el.name === data.district)?.id || ""
                }
                onChange={handleRegionInfo}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">{tr("districtLabel")}</option>
                {districts.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>
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
