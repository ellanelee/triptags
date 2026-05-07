"use client"

import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import MapPicker from "@/components/common/maps/MapPicker"
import { useRouter } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import { INITIAL_VENUE_UPDATE, INITIAL_VENUE_UPDATE_DATA } from "@/lib/utils/common/const"
import { ForbiddenError } from "@/lib/utils/common/validations"
import { venueResponseForm } from "@/lib/utils/domain/venue.update"
import { useAuthStore } from "@/store/auth-store"
import { IGetVenueBase } from "@/types/interfaces/interface.api"
import { IVenueAdminUpdate, Language } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function EditVenueDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const venueId = params.id
  const locale = useLocale()
  const tr = useTranslations("VenueDetailPage")
  const t = useTranslations("Common")
  const { isAuthenticated, user } = useAuthStore()
  const venue = useAsync<IGetVenueBase>(null)
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<"kakao" | "google">("kakao")
  const [venueUpdateData, setVenueUpdateData] =
    useState<IVenueAdminUpdate>(INITIAL_VENUE_UPDATE)
  const [formLoadError, setFormLoadError] = useState<string | null>(null)

  const isAdmin = user?.role === "ADMIN"
  const isCreator = user?.id === venue.data?.createdBy
  
  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
    venue.run(() => venueApi.getVenueById(venueId))
  }, [venueId, isAuthenticated])

  useEffect(() => {
    if (!venue.data) return
    if (!isAdmin || !isCreator) throw new ForbiddenError(t("NoPermission"))
    try {
      const form = venueResponseForm(venue.data, locale as Language)
      setVenueUpdateData(form)
      setFormLoadError(null)
    } catch (e) {
      setFormLoadError(
        e instanceof Error ? e.message : "Fail_to_fetch_venue_information",
      )
    }
  }, [venue.data, venue.loading, locale])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await venueApi.createVenue(venuePayload)
      await venueApi.createVenueDetail(response.id, venueDetailsPayload)
      router.replace(`/venues/${response.id}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-8">{tr("title")}</h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 장소찾기 map 설정*/}
              {isAdmin && (
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    {tr("updateVenuePosition")}
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setSearchType("kakao")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        searchType === "kakao"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      카카오(국내)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType("google")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        searchType === "google"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      구글 (해외)
                    </button>
                  </div>
                  {searchType === "kakao" ? (
                    <KakaoPlaceSearch
                      onPlaceSelected={handleKaKaoPlaceSelected}
                      placeholder={tr("searchPlaceHolder")}
                    ></KakaoPlaceSearch>
                  ) : (
                    <PlaceAutoComplete
                      onPlaceSelected={handleGooglePlaceSelected}
                      placeHolder={tr("searchPlaceHolder")}
                    ></PlaceAutoComplete>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {searchType === "kakao"
                      ? "국내 장소는 카카오 검색을 추천합니다"
                      : tr("searchHint")}
                  </p>
                </div>
              )}
              {/* map 구현*/}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {tr("selectOnMap")}
                  </label>
                  {venueUpdateData?.latitude && venueUpdateData?.longitude && (
                    <button
                      type="button"
                      onClick={() => {
                        setVenueUpdateData(INITIAL_VENUE_UPDATE_DATA)
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      {tr("selectInit")}
                    </button>
                  )}
                </div>
                {/*위치 선택*/}
                <MapPicker
                  center={currentCoordinates}
                  markerPosition={currentCoordinates}
                  onLocationSelect={handleMapClick}
                />
                {/*위치에 대한 내용 표시 */}
                <div className="text-sm text-gray-500 my-2">
                  {venueData.latitude && venueData.longitude ? (
                    <>
                      <p>
                        {`${countryName}, ${venueData.city} ${venueData.district} ${venueData.details}`}
                        <span>{tr("checkAddress")}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {tr("coordinates")}: {venueData.latitude?.toFixed(6)},{" "}
                        {venueData.longitude?.toFixed(6)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 my-4">
                      {tr("noLocationSelected")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col bg-pink-50 rounded-md px-3 py-2">
                {/*이름표시*/}
                <FormField error={submitted ? errors.name : ""}>
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 my-2 flex-shrink:0 whitespace-nowrap">
                      {tr("name")} ({tr("language")}: {locale})
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border text-sm bg-white border-gray-300 rounded-md m-2 px-2 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={venueData.name}
                      onChange={(e) =>
                        setVenueData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </FormField>
                {/*카테고리 표시*/}
                <FormField error={submitted ? errors.venueCategory : ""}>
                  <div className="flex my-2 items-center">
                    <label className="block text-sm font-medium text-gray-700 my-2 mr-2">
                      {tr("category")} *
                    </label>
                    <select
                      required
                      className="text-sm font-medium text-gray-700"
                      value={venueData.venueCategory ?? ""}
                      onChange={(e) =>
                        setVenueData((prev) => ({
                          ...prev,
                          venueCategory: e.target.value || null,
                        }))
                      }
                    >
                      <option value="">{tr("selectCategory")}</option>
                      {venueCategories.map((el) => (
                        <option key={el} value={el} className="text-sm">
                          {t(`categories.${el}`)}
                        </option>
                      ))}
                    </select>
                    <div className="text-sm font-medium text-gray-700 mx-2">
                      ( "{venueDetail.subCategory}" cagegorized by Infomation
                      provider )
                    </div>
                  </div>
                </FormField>
                {/*설명 표시*/}
                <FormField error={submitted ? errors.venueCategory : ""}>
                  <label className="block text-sm font-medium text-gray-700 my-2">
                    {tr("description")}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full  bg-white border border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueData.description || ""}
                    onChange={(e) =>
                      setVenueData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </FormField>
              </div>
              {/*주소표시 */}
              <div className="grid grid-cols-2 gap-3 bg-pink-50 rounded-md p-3">
                <FormField error={submitted ? errors.city : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("city")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueData.city}
                    onChange={(e) =>
                      setVenueData((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                </FormField>
                <FormField error={submitted ? errors.district : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("district")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueData.district}
                    onChange={(e) =>
                      setVenueData((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                  />
                </FormField>
                <FormField error={submitted ? errors.details : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("details")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueData.details}
                    onChange={(e) =>
                      setVenueData((prev) => ({
                        ...prev,
                        details: e.target.value,
                      }))
                    }
                  />
                </FormField>
              </div>
              {/* VenueDetail정보 */}
              <div className="grid grid-cols-2 gap-4  bg-pink-50 rounded-md p-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("phone")}
                  </label>
                  <input
                    type="tel"
                    className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueDetail.phoneNumber || ""}
                    onChange={(e) =>
                      setVenueDetail((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("website")}
                  </label>
                  <input
                    type="url"
                    className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueDetail.websiteUrl}
                    onChange={(e) =>
                      setVenueDetail((prev) => ({
                        ...prev,
                        websiteUrl: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("priceRange")}
                  </label>
                  <input
                    type="text"
                    className="w-full border  bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueDetail.priceRange}
                    onChange={(e) =>
                      setVenueDetail((prev) => ({
                        ...prev,
                        priceRange: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("workHour")}
                  </label>
                  <input
                    type="text"
                    className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
                    value={venueDetail.workHour ?? ""}
                    onChange={(e) =>
                      setVenueDetail((prev) => ({
                        ...prev,
                        workHour: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t("transaction.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading
                    ? t("transaction.creating")
                    : t("transaction.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
