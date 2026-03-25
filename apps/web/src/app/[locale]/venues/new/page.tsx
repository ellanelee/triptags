"use client"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { useRouter } from "@/i18n/routing"
import { useAuthStore } from "@/store/auth-store"
import { IVenueCreate } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export interface kakaoPlaceSelected {
  id: string
  name: string
  address: string
  roadAddress: string
  phone: string
  latitude: number
  longitude: number
  category: string
  placeUrl: string
}

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
  const [searchType, setSearchType] = useState<"kakao" | "google">("kakao")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")

  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
  }, [isAuthenticated])

  const handleKaKaoPlaceSelected = (place: kakaoPlaceSelected) => {
    const address = place.roadAddress || place.address || ""
    const addressParts = place.address.split(" ").filter(Boolean) // address format: 서울 강남구 역삼동 ...
    const city = addressParts[0] || ""
    const district = addressParts[1] || ""
    const details = addressParts.slice(2).join(" ")
    setVenueCreateForm((prev) => ({
        ...prev,
      language: "ko",
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      country: "KR",
      city:city,
      district: district,
      details: details,
    }))
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
                  <KakaoPlaceSearch onPlaceSelected={handleKaKaoPlaceSelected} placeholder="장소명을 검색하세요(예: 경복궁, 강남역 맛집)"></KakaoPlaceSearch>
                ) : (
                  <PlaceAutoComplete></PlaceAutoComplete>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
