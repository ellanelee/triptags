"use client"
import { venueCategories } from "@/components/common/const"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import MapPicker from "@/components/common/maps/MapPicker"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { useRouter } from "@/i18n/routing"
import { localeCountryName } from "@/lib/utils/country"
import { syncGoogleVenueDetails } from "@/lib/utils/googledetails"
import { patchVenueFromGoogle } from "@/lib/utils/googlevenueupdate"
import { useAuthStore } from "@/store/auth-store"
import { IKakaoPlaceSelected } from "@/types/maps/kakao"
import { IVenueCreate, IVenueDetailInput } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function CreateVenuePage() {
  const router = useRouter()
  const locale = useLocale()
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")
  const { isAuthenticated, user } = useAuthStore()
  const [searchType, setSearchType] = useState<"kakao" | "google">("kakao")
  const [countryName, setCountryName] = useState("")
  const [venueData, setVenueData] = useState<IVenueCreate>({
    language: "ko",
    name: "",
    description: "",
    venueCategory: null,
    latitude: null,
    longitude: null,
    country: "",
    city: "",
    district: "",
    details: "",
    googlePlaceId: "",
  })
  const [venueDetail, setVenueDetail] = useState<IVenueDetailInput>({
    phoneNumber: "",
    websiteUrl: "",
    workHour: {},
  })

  const { latitude: lat, longitude: lng } = venueData
  const currentCoordinates =
    venueData.latitude && venueData.longitude
      ? { lat: venueData.latitude, lng: venueData.longitude }
      : null

  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
  }, [isAuthenticated])

  const updateVenueFromGoogle = (
    result: google.maps.GeocoderResult | google.maps.places.PlaceResult,
  ) => {
    if (!result.geometry?.location) return null
    const lat = result.geometry.location.lat()
    const lng = result.geometry.location.lng()
    const placeId = result.place_id
    const patchedData = patchVenueFromGoogle(result, localeCountryName, locale)
    const { country, city, district, details, countryName } = patchedData
    setVenueData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      country,
      city,
      district,
      details,
      googlePlaceId: placeId,
    }))
    setCountryName(countryName)
    if (placeId) {
      syncGoogleVenueDetails(placeId, {
        onVenueUpdate: (data) => {
          setVenueData((prev) => ({ ...prev, ...data }))
        },
        onDetailUpdate: (data) => {
          setVenueData((prev) => ({ ...prev, ...data }))
        },
      })
    }
  }
  //카카오 지도객체에서 입력어 관련장소검색
  const handleKaKaoPlaceSelected = (place: IKakaoPlaceSelected) => {
    const addressParts = place.address.split(" ").filter(Boolean) // address format: 서울 강남구 역삼동 ...
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
    setCountryName(localeCountryName("KR", locale))
  }

  //지도에서 위치를 선택하기 (역지오코딩,구글맵 좌표->주소변환)
  const handleMapClick = async (location: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder() // geocode 변환 (lat, lng)
    const { results } = await geocoder.geocode({ location })
    if (results[0]) {
      updateVenueFromGoogle(results[0])
    }
  }

  //구글지도에서 선택 (역지오코딩, 구글 장소검색 결과 좌표->주소변환)
  const handleGooglePlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log("구글에서 선정한 장소 위치: ", place)
    updateVenueFromGoogle(place)
  }

  const handleSubmit = () => {}

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-8">{tr("title")}</h1>
            <form className="space-y-6">
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
                      onClick={() =>
                        setVenueData((prev) => ({
                          language: "ko",
                          name: "",
                          description: "",
                          venueCategory: null,
                          latitude: null,
                          longitude: null,
                          country: "",
                          city: "",
                          district: "",
                          details: "",
                          googlePlaceId: "",
                        }))
                      }
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
                <div className="text-sm text-gray-500 mt-2">
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
                    <p>{tr("noLocationSelected")}</p>
                  )}
                </div>
                {/*이름표시*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("name")} (언어표시: {locale})
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={venueData.name}
                    onChange={(e) =>
                      setVenueData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/*카테고리 표시*/}
              <div>
                <label className="">{tr("category")}</label>
                <select
                  required
                  className=""
                  value={venueData.venueCategory}
                  onChange={(e) =>
                    setVenueData((prev) => ({
                      ...prev,
                      venueCategory: e.target.value,
                    }))
                  }
                >
                  <option>{tr("selectCategory")}</option>
                  {venueCategories.map((el) => (
                    <option key={el} value={el}>
                      {t(`cateogies.${el}`)}
                    </option>
                  ))}
                </select>
              </div>
              {/*설명 표시*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr("description")}
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={venueData.description || ""}
                  onChange={(e) =>
                    setVenueData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              {/*주소표시 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("city")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={venueData.city}
                    onChange={(e) =>
                      setVenueData((prev)=> ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("district")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={venueData.city}
                    onChange={(e) =>
                      setVenueData((prev)=> ({ ...prev, district: e.target.value }))
                    }
                  />
              </div>
              {/* 기타 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr('phone')}
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={venueDetail.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('website')}
                  </label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
