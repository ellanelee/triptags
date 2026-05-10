"use client"
import {
  INITIAL_VENUE_DATA,
  INITIAL_VENUE_DETAIL,
} from "@/lib/utils/common/const"
import { FormField } from "@/components/common/form/FormField"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import MapPicker from "@/components/common/maps/MapPicker"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { useRouter } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { CountryUtils } from "@/lib/utils/domain/country.utils"
import { syncGoogleVenueDetails } from "@/lib/utils/maps/googledetails"
import { updateVenueFromGoogle } from "@/lib/utils/maps/googlevenueupdate"
import {
  IFormErrors,
  validateVenueCreateForm,
} from "@/lib/utils/domain/validateVenue"
import { useAuthStore } from "@/store/auth-store"
import { IKakaoPlaceSelected } from "@/types/maps/kakao"
import { IVenueCreatePayload } from "@/types/types"
import {
  IRegisterInput,
  venueCategories,
  type IVenueCreate,
  type IVenueDetailInput,
} from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { LanguageSelect } from "@/components/common/LanguageSelect"
import { VenueImageEdit } from "@/components/venue/VenueImageEditField"

export default function CreateVenuePage() {
  const router = useRouter()
  const locale = useLocale()
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<IFormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [searchType, setSearchType] = useState<"kakao" | "google">("kakao")
  const [countryName, setCountryName] = useState("")
  const [venueData, setVenueData] = useState<IVenueCreate>(INITIAL_VENUE_DATA)
  const [venueDetail, setVenueDetail] =
    useState<IVenueDetailInput>(INITIAL_VENUE_DETAIL)
  const currentCoordinates =
    venueData.latitude && venueData.longitude
      ? { lat: venueData.latitude, lng: venueData.longitude }
      : null

  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
  }, [isAuthenticated])

  //카카오 지도객체에서 장소검색 및 선택
  const handleKaKaoPlaceSelected = (place: IKakaoPlaceSelected) => {
    const addressParts = place.roadAddress.split(" ").filter(Boolean) // address format: 서울 강남구 역삼동 ...
    const city = addressParts[0] || ""
    const district = addressParts[1] || ""
    const details = addressParts.slice(2).join(" ")
    setVenueData((prev) => ({
      ...prev,
      language: "ko",
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      country: "KR",
      city: city,
      district: district,
      details: details,
    }))
    setCountryName(CountryUtils.getCountryName("KR", locale))
    setVenueDetail((prev) => ({
      ...prev,
      phoneNumber: place.phone,
      subCategory: place.category,
      websiteUrl: place.placeUrl,
    }))
  }

  //구글검색결과에서 특정 장소 선택시 객체정보 전달 및 변환
  const handleGooglePlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log("구글에서 선정한 장소 위치: ", place)
    handleUpdateVenueFromGoogle(place)
  }

  //특정한 장소의 객체정보를 인자로 db용 정보추출, 상태로 저장
  const handleUpdateVenueFromGoogle = (
    result: google.maps.GeocoderResult | google.maps.places.PlaceResult,
  ) => {
    const processedResult = updateVenueFromGoogle(result, locale)
    if (processedResult) {
      const { countryName, ...venueUpdateFromGoogle } = processedResult
      setVenueData((prev) => ({
        ...prev,
        ...venueUpdateFromGoogle,
      }))
      setCountryName(processedResult.countryName)
      if (processedResult.googlePlaceId) {
        syncGoogleVenueDetails(processedResult.googlePlaceId, {
          onVenueUpdate: (data) => {
            setVenueData((prev) => ({ ...prev, ...data }))
          },
          onDetailUpdate: (data) => {
            setVenueDetail((prev) => ({ ...prev, ...data }))
          },
        })
      }
    }
  }

  //구글맵에서 직접 위치 선택, 역지오코딩 후 정보추출 후 상태저장 (구글맵 좌표->주소변환->db용 정보변환->form상태저장)
  const handleMapClick = async (location: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder() // geocode 변환 (lat, lng)
    const { results } = await geocoder.geocode({ location })
    if (results[0]) {
      handleUpdateVenueFromGoogle(results[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const inputErrors = validateVenueCreateForm({ venueData })
    setErrors(inputErrors)
    setSubmitted(true)
    if (Object.keys(inputErrors).length > 0) {
      console.log("Venue input검증 중 에러발생")
      setLoading(false)
      return
    }
    try {
      const venuePayload: IVenueCreatePayload = {
        ...venueData,
        latitude: venueData.latitude ?? undefined,
        longitude: venueData.longitude ?? undefined,
        venueCategory: venueData.venueCategory ?? undefined,
      }
      const venueDetailsPayload: IVenueDetailInput = {
        ...venueDetail,
        workHour: { [locale]: venueDetail.workHour ?? undefined },
      }
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
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2">
                  {tr("searchPlace")}
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
              {/* map 구현*/}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {tr("selectOnMap")}
                  </label>
                  {venueData.latitude && venueData.longitude && (
                    <button
                      type="button"
                      onClick={() => {
                        setVenueData(INITIAL_VENUE_DATA)
                        setVenueDetail(INITIAL_VENUE_DETAIL)
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      {tr("selectInit")}
                    </button>
                  )}
                </div>
                {/*위치 선택*/}
                <MapPicker
                  center={currentCoordinates ?? undefined}
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
                {/*언어표시*/}
                <FormField error={submitted ? errors.name : ""}>
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 my-2 flex-shrink:0 whitespace-nowrap">
                      {t("transaction.language")}
                    </label>
                    <LanguageSelect
                      label={t("transaction.language")}
                      value={venueData.language}
                      onChange={(val) =>
                        setVenueData({
                          ...venueData,
                          language: val as IRegisterInput["language"],
                        })
                      }
                      tr={t}
                    />
                  </div>
                </FormField>
                {/*이름표시*/}
                <FormField error={submitted ? errors.name : ""}>
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 my-2 flex-shrink:0 whitespace-nowrap">
                      {tr("name")} ({t("transaction.language")}: {locale})
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
              <VenueImageEdit />
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
