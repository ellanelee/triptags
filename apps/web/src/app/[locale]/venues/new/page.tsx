"use client"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { useRouter } from "@/i18n/routing"
import { useAuthStore } from "@/store/auth-store"
import { IGooglePlaceInfo } from "@/types/maps/google"
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
  const [venueCreateForm, setVenueCreateForm] = useState<IVenueCreate>({
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
  const [googleDataForm, setGoogleDataForm] = useState<IGooglePlaceInfo>({
    googlePlaceId: "",
    googleName: "",
    googleAddress: "",
    googleTypes: [] as string[],
    googleRating: undefined as number | undefined,
    googleUrl: "",
  })

  const [venueDetail, setVenueDetail] = useState<IVenueDetailInput>({
  phoneNumber: '',
  priceRange: '',
  subCategory: '',
  websiteUrl: '',
  workHour: {},
  description: {},
  })

  const [searchType, setSearchType] = useState<"kakao" | "google">("kakao")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")

  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
  }, [isAuthenticated])

  const handleKaKaoPlaceSelected = (place: IKakaoPlaceSelected) => {
    const address = place.roadAddress || place.address || ""
    const addressParts = place.address.split(" ").filter(Boolean) // address format: 서울 강남구 역삼동 ...
    const city = addressParts[0] || ""
    const district = addressParts[1] || ""
    const details = addressParts.slice(2).join(" ")
    setVenueCreateForm((prev) => ({
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
  }

  const handleMapClick = (location: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder() // geocode 변환
  }
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
                    구글 (해외)x
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
                    {t("selectOnMap")}
                  </label>
                  {formData.latitude !== 0 && formData.longitude !== 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: 0,
                          longitude: 0,
                          address: "",
                          city: "",
                          district: "",
                          googlePlaceId: "",
                          googleName: "",
                          googleAddress: "",
                          name: {},
                        }))
                      }
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      장소 선택 취소
                    </button>
                  )}
                  {/*위치 선택*/}
                  <MapPicker
                    center={
                      formData.latitude !== 0 && formData.longitude !== 0
                        ? { lat: formData.latitude, lng: formData.longitude }
                        : undefined
                    }
                    markerPosition={
                      formData.latitude !== 0 && formData.longitude !== 0
                        ? { lat: formData.latitude, lng: formData.longitude }
                        : null
                    }
                    onLocationSelect={handleMapClick}
                  />
                </div>
                {/*위치 표시 */}
                <div className="text-sm text-gray-500 mt-2">
                  {formData.latitude !== 0 && formData.longitude !== 0 ? (
                    <>
                      <p>{formData.address || "주소 정보 없음"}</p>
                      <p className="text-xs text-gray-400">
                        {t("coordinates")}: {formData.latitude.toFixed(6)},{" "}
                        {formData.longitude.toFixed(6)}
                      </p>
                    </>
                  ) : (
                    <p>선택한 위치 없음</p>
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
