"use client"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { VenueBasicForm } from "@/components/venue/venueForms/VenueBasicForm"
import { VenueDetailForm } from "@/components/venue/venueForms/VenueDetailForm"
import { VenueImageEdit } from "@/components/venue/venueImage/VenueImageEditField"
import { VenueRegionForm } from "@/components/venue/venueForms/VenueRegionForm"
import { useRouter } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import {
  INITIAL_VENUE_UPDATE,
  INITIAL_VENUE_UPDATE_DATA,
} from "@/lib/utils/common/const"
import { ForbiddenError } from "@/lib/utils/common/validations"
import {
  IFormErrors,
  validateVenueCreateForm,
} from "@/lib/utils/domain/venue.create.validate"
import { venueResponseToEditForm } from "@/lib/utils/domain/venue.response.toEdit"
import { updateVenueFromGoogle } from "@/lib/utils/maps/googlevenueupdate"
import { useAuthStore } from "@/store/auth-store"
import { IGetVenueBase } from "@/types/interfaces/interface.api"
import {
  IVenueAdminUpdate,
  IVenueAdminUpdateInput,
  IVenueCreatorUpdate,
  IVenueDetailInput,
  Language,
} from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { VenueSubmit } from "@/components/venue/venueForms/VenueSubmit"
import { VenuePlaceForm } from "@/components/venue/venueForms/VenuePlaceForm"
import { IKakaoPlaceSelected } from "@/types/maps/kakao"
import { CountryUtils } from "@/lib/utils/domain/country.utils"

export default function EditvenueUpdateDataPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const venueId = params.id
  const locale = useLocale()
  const tr = useTranslations("UpdateVenuePage")
  const t = useTranslations("Common")
  const { isAuthenticated, user } = useAuthStore()
  const venue = useAsync<IGetVenueBase>(null)
  const [countryName, setCountryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<IFormErrors>({})
  const [searchType, setSearchType] = useState<"kakao" | "google">("kakao")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [venueUpdateData, setVenueUpdateData] =
    useState<IVenueAdminUpdateInput>(INITIAL_VENUE_UPDATE_DATA)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    locale as Language,
  )
  const [submitted, setSubmitted] = useState(false)
  const [formLoadError, setFormLoadError] = useState<string | null>(null)

  //User Authority
  const isAdmin = user?.role === "ADMIN"
  const isCreator = user?.id === (venue && venue.data?.createdBy) ? true : false
  const canEditLanguage = isAdmin || isCreator
  const canEditName = isAdmin || isCreator
  const canEditCategory = isAdmin
  const canEditDescription = isAdmin
  const canEditImage = isAdmin || isCreator
  const canEditRegion = isAdmin
  const canEditVenueDetail = isAdmin
  const canEditMap = isAdmin

  //Patch VenueInfo from DB
  useEffect(() => {
    if (!isAuthenticated) router.replace("/venues")
    venue.run(() => venueApi.getVenueById(venueId))
  }, [venueId, isAuthenticated])

  //imageUrl
  useEffect(() => {
    if (!venue.data || !venue.data) return
  }, [venue.data])
  //Check Authority, Field Valiation, Set State
  useEffect(() => {
    if (!venue.data) return
    if (!isAdmin && !isCreator) throw new ForbiddenError(t("NoPermission"))
    try {
      //select language to show ( in case of I18nText)
      const form = venueResponseToEditForm(venue.data, selectedLanguage)
      setVenueUpdateData(form)
      setFormLoadError(null)
      setImageUrls(venue.data?.venueImages.map((el) => el.imageUrl))
    } catch (e) {
      setFormLoadError(
        e instanceof Error ? e.message : "Fail_to_fetch_venue_information",
      )
    }
  }, [venue.data, selectedLanguage, venue.loading, locale])

  //카카오 지도객체에서 장소검색 및 선택,Update Position/Region Info
  const handleKaKaoPlaceSelected = (place: IKakaoPlaceSelected) => {
    const addressParts = place.roadAddress.split(" ").filter(Boolean) // address format: 서울 강남구 역삼동 ...
    const city = addressParts[0] || ""
    const district = addressParts[1] || ""
    const details = addressParts.slice(2).join(" ")
    setVenueUpdateData((prev) => ({
      ...prev,
      language: "ko",
      latitude: place.latitude,
      longitude: place.longitude,
      country: "KR",
      city: city,
      district: district,
      details: details,
    }))
    setCountryName(CountryUtils.getCountryName("KR", locale))
  }

  //구글검색결과에서 특정 장소 선택시 객체정보 전달 및 변환
  const handleGooglePlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log("구글에서 선정한 장소 위치: ", place)
    handleUpdateVenueFromGoogle(place)
  }

  //구글맵에서 위치 Click reverse_geocode (좌표->주소변환)처리 및 db저장용 형식변환
  const handleUpdateVenueFromGoogle = (
    result: google.maps.GeocoderResult | google.maps.places.PlaceResult,
  ) => {
    const processedResult = updateVenueFromGoogle(result, locale)
    if (processedResult) {
      const { countryName, ...venueUpdateFromGoogle } = processedResult
      setVenueUpdateData((prev) => ({
        ...prev,
        ...venueUpdateFromGoogle,
      }))
      setCountryName(processedResult.countryName)
    }
  }

  //Select position at GoogleMap (역지오코딩,구글맵 좌표->주소변환)
  const handleMapClick = async (location: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder() // geocode 변환 (lat, lng)
    const { results } = await geocoder.geocode({ location })
    if (results[0]) {
      handleUpdateVenueFromGoogle(results[0])
    }
  }

  //Submit Edited Venue
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    //Venue 필수입력칸 검증
    const inputErrors = validateVenueCreateForm({
      venueData: venueUpdateData,
    })
    setErrors(inputErrors)
    setSubmitted(true)
    if (Object.keys(inputErrors).length > 0) {
      console.log("Verification Error of venueInput")
      setLoading(false)
      return
    }
    try {
      let responseId
      const {
        language,
        name,
        description,
        phoneNumber,
        priceRange,
        websiteUrl,
        workHour,
        ...venueBaseData
      } = venueUpdateData
      const adminUpdatePayload: IVenueAdminUpdate = {
        ...venueBaseData,
        name: { [language]: name },
        description: { [language]: description },
        venueImage: imageUrls,
      }
      const creatorUpdatePayload: IVenueCreatorUpdate = {
        name: { [language]: name },
        description: { [language]: description },
        venueImage: imageUrls,
      }
      const venueDetail: IVenueDetailInput = {
        phoneNumber,
        priceRange,
        websiteUrl,
        workHour: { [language]: workHour },
      }
      if (isAdmin) {
        const response = await venueApi.updateVenueByAdmin(
          venueId,
          adminUpdatePayload,
        )
        await venueApi.updateVenueByAdmin(venueId, adminUpdatePayload)
        responseId = response.id
      }
      if (isCreator) {
        const response = await venueApi.updateVenueByUser(
          venueId,
          creatorUpdatePayload,
        )
        responseId = response.id
      }
      await venueApi.createOrUpdateVenueDetail(venueId, venueDetail)
      router.replace(`/venues/${venueId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setVenueUpdateData(INITIAL_VENUE_UPDATE)
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
                venueData={venueUpdateData}
                countryName={countryName}
                setCountryName={setCountryName}
                handleReset={handleReset}
                handleKaKaoPlaceSelected={handleKaKaoPlaceSelected}
                handleGooglePlaceSelected={handleGooglePlaceSelected}
                handleMapClick={handleMapClick}
                canEditMap={canEditMap}
              />
              {/*언어 및 기본사항 표시*/}
              <VenueBasicForm
                venueData={venueUpdateData}
                onLanguageChange={setSelectedLanguage}
                onVenueBasicChange={setVenueUpdateData}
                submitted={submitted}
                selectedLanguage={selectedLanguage}
                errors={errors}
                canEditLanguage={canEditLanguage}
                canEditName={canEditName}
                canEditCategory={canEditCategory}
                canEditDescription={canEditDescription}
              />
              {/*주소표시 */}
              <VenueRegionForm
                venueData={venueUpdateData}
                setVenueData={setVenueUpdateData}
                submitted={submitted}
                errors={errors}
                canEditRegion={canEditRegion}
              />
              {/* VenueDetail정보 */}
              <VenueDetailForm
                venueDetail={venueUpdateData}
                setVenueDetail={setVenueUpdateData}
                canEditVenueDetail={canEditVenueDetail}
              />
              <VenueImageEdit
                imageUrls={imageUrls}
                onAdd={(url) => setImageUrls((prev) => [...prev, url])}
                canEditImage={canEditImage}
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
