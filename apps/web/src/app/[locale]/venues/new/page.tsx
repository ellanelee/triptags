"use client"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import MapPicker from "@/components/common/maps/MapPicker"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { useRouter } from "@/i18n/routing"
import { localeCountryName } from "@/lib/utils/country"
import { parseGeoCodeAddress } from "@/lib/utils/getGoogleAddress"
import { useAuthStore } from "@/store/auth-store"
import { IGooglePlaceInfo } from "@/types/maps/google"
import { IKakaoPlaceSelected } from "@/types/maps/kakao"
import { PositionInfo } from "@/types/types"
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
  const [markerPosition, setMarkerPosition] = useState<PositionInfo>({})
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
  })
  const [googleData, setGoogleData] = useState<IGooglePlaceInfo>({
    googlePlaceId: "",
    googleName: "",
    googleAddress: "",
    googleTypes: [],
    googleRating: undefined,
    googleUrl: "",
  })
  const [venueDetail, setVenueDetail] = useState<IVenueDetailInput>({
    phoneNumber: "",
    priceRange: "",
    subCategory: "",
    websiteUrl: "",
    workHour: {},
    description: {},
  })

  const { latitude: lat, longitude: lng } = venueData
  const currentCoordinates =
    venueData.latitude && venueData.longitude
      ? { lat: venueData.latitude, lng: venueData.longitude }
      : null

  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
  }, [isAuthenticated])

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
      venueCategory: place.category,
      latitude: place.latitude,
      longitude: place.longitude,
      country: "KR",
      city: city,
      district: district,
      details: details,
    }))
    setCountryName(localeCountryName("KR", locale))
  }

  //지도에서 위치를 선택하기 (역지오코딩,좌표를 주소로 변환)
  const handleMapClick = async (location: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder() // geocode 변환 (lat, lng)
    const { results } = await geocoder.geocode({ location })
    const geocodeInfo = results[0]
    if (!geocodeInfo) return

    let countryName = localeCountryName("KR", locale)
    let adminLevel1 = "" // 시/도
    let locality = "" // 시 (경주시 등)
    let sublocalityLevel1 = "" // 구 (강서구 등)
    let adminLevel2 = "" // fallback
    let route = ""
    let streetNumber = ""

    const parsedResult = parseGeoCodeAddress({
      result: geocodeInfo,
      localeCountryName,
      locale,
    })
    console.log(parsedResult)
    setVenueData((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      country: parsedResult.countryCode,
      city: parsedResult.city,
      district: parsedResult.district,
      details: parsedResult.details,
    }))
    setCountryName(parsedResult.countryName)
  }

  //구글지도에서 선택
  const handleGooglePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return
  }

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
                    placeholder="장소명을 검색하세요(예: 경복궁, 강남역 맛집)"
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
