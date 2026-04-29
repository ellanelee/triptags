"use client"

import { destinationApi } from "@/lib/api/destination.api"
import { regionApi } from "@/lib/api/region.api"
import { useAsync } from "@/lib/hooks/use.async"
import { CountryUtils } from "@/lib/utils/country.utils"
import { useAuthStore } from "@/store/auth-store"
import { DestinationWithRegion, RegionInfo } from "@/types/types"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MyDestination() {
  const tr = useTranslations("Destination")
  const t = useTranslations("Common")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [country, setCountry] = useState("")
  const [cities, setCities] = useState<RegionInfo[]>([])
  const [districts, setDistricts] = useState<RegionInfo[]>([])
  const [data, setData] = useState({
    country: "",
    city: "",
    district: "",
    priority: 0,
  })
  const countryList = CountryUtils.getAllCountries(CountryUtils.toCountryLang(locale))
  const countryInfo = useAsync<string>("")
  const regionInfo = useAsync<RegionInfo[]>([])
  const destinationsInitials = useAsync<DestinationWithRegion[]>([])
  const fullAddress = [data.country, data.city, data.district].join(" ") || ""

  const extractSub = async (parentId: string) => {
    return await regionInfo.run(() => regionApi.getSubRegion(parentId))
  }

  useEffect(() => {
    if (!isAuthenticated) router.replace(`/${locale}/login`)
    destinationsInitials.run(() => destinationApi.getInfo())
  }, [destinationsInitials.run])

  const handleSubmitDestination = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
    } catch (error) {
    } finally {
    }
  }
  const handleCountryInfo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const selected = countryList.find((el) => el.code === code)
    setData((prev) => ({
      ...prev,
      country: selected?.name ?? "",
      city: "",
      district: "",
      priority: 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.country || !data.city || !data.district || !data.priority) {
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
      const response = await destinationApi.create(submitData)
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
            {tr("setTitle") ?? "나의 여행지 설정"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {tr("destinationHelp") ?? "국가/도시/구·군를 입력하면 저장됩니다."}
          </p>
        </div>

        {/* 폼 카드 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {/* 미리보기 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {tr("destinationPreview") ?? "주소 미리보기"}
              </p>
              <button
                type="button"
                onClick={() =>
                  setData({
                    country: "",
                    city: "",
                    district: "",
                    priority: 0,
                  })
                }
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                {t("transaction.reset") ?? "초기화"}
              </button>
            </div>

            <div className="mt-2 rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
              {fullAddress ||
                (tr("DestinationEmpty") ?? "아직 입력된 주소가 없어요.")}
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

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {tr("priority") ?? "우선 순위 (0~9사이에서 선택"}
              </label>
              <input
                id="priority"
                name="priority"
                type="number"
                min="0"
                max="9"
                value={data.priority || ""}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setData((prev) => ({ ...prev, priority: value }))
                }}
                placeholder={tr("priorityPlaceholder")}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
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
                disabled={
                  !data.country ||
                  !data.city ||
                  !data.district ||
                  !data.priority
                }
                title={
                  !data.country || !data.city || !data.district
                    ? (tr("addressRequired") ??
                      "국가/시도/구군 및 우선순위는 필수 입력입니다.")
                    : undefined
                }
              >
                {t("transaction.save") ?? "저장"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
