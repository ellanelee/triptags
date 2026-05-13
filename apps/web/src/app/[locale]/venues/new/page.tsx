"use client"
import {
  INITIAL_VENUE_DATA,
  INITIAL_VENUE_DETAIL,
} from "@/lib/utils/common/const"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
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
import { IVenueCreatePayload, SelectSearchType } from "@/types/types"
import {
  IVenueDetailPayload,
  type IVenueCreate,
  type IVenueDetailInput,
} from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { VenueImageEdit } from "@/components/venue/venueImage/VenueImageEditField"
import { VenueRegionForm } from "@/components/venue/venueForms/VenueRegionForm"
import { VenueDetailForm } from "@/components/venue/venueForms/VenueDetailForm"
import { VenueBasicForm } from "@/components/venue/venueForms/VenueBasicForm"
import { VenuePlaceForm } from "@/components/venue/venueForms/VenuePlaceForm"
import { VenueSubmit } from "@/components/venue/venueForms/VenueSubmit"

export default function CreateVenuePage() {
  const router = useRouter()
  const locale = useLocale()
  const tr = useTranslations("CreateVenuePage")
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<IFormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [searchType, setSearchType] = useState<SelectSearchType>("kakao")
  const [countryName, setCountryName] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [venueData, setVenueData] = useState<IVenueCreate>(INITIAL_VENUE_DATA)
  const [venueDetail, setVenueDetail] =
    useState<IVenueDetailInput>(INITIAL_VENUE_DETAIL)

  //User Authority
  const canEditAll = true

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
      const venueDetailsPayload: IVenueDetailPayload = {
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

  const handleReset = () => {
    setVenueData(INITIAL_VENUE_DATA)
    setVenueDetail(INITIAL_VENUE_DETAIL)
  }

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-8">{tr("title")}</h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 장소찾기 map 설정*/}
              <VenuePlaceForm
                searchType={searchType}
                setSearchType={setSearchType}
                venueData={venueData}
                countryName={countryName}
                setCountryName={setCountryName}
                handleReset={handleReset}
                handleKaKaoPlaceSelected={handleKaKaoPlaceSelected}
                handleGooglePlaceSelected={handleGooglePlaceSelected}
                handleMapClick={handleMapClick}
                canEditMap={canEditAll}
                VenuePlaceFormTextNameSpace={"CreateVenuePage"}
              />
              {/*언어 및 기본사항 표시*/}
              <VenueBasicForm
                venueData={venueData}
                setVenueData={setVenueData}
                errors={errors}
                submitted={submitted}
                locale={locale}
                canEditName={canEditAll}
                canEditDescription={canEditAll}
                canEditCategory={canEditAll}
              />
              {/*주소표시 */}
              <VenueRegionForm
                venueData={venueData}
                setVenueData={setVenueData}
                errors={errors}
                submitted={submitted}
                canEditRegion={canEditAll}
              />
              {/* VenueDetail정보 */}
              <VenueDetailForm
                venueDetail={venueDetail}
                setVenueDetail={setVenueDetail}
                canEditVenueDetail={canEditAll}
              />
              {/* VenueImage정보 */}
              <VenueImageEdit
                imageUrls={imageUrls}
                onAdd={(url) => setImageUrls((prev) => [...prev, url])}
                onDelete={(url) =>
                  setImageUrls((prev) => prev.filter((item) => item !== url))
                }
              />
              {/* Submit */}
              <VenueSubmit loading={loading} />
            </form>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
