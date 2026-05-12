"use client"

import { FormField } from "@/components/common/form/FormField"
import { GoogleMapsProvider } from "@/components/common/maps/GoogleMapsProvider"
import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import MapPicker from "@/components/common/maps/MapPicker"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { VenueBasicForm } from "@/components/venue/venueForms/VenueBasicForm"
import { VenueDetailForm } from "@/components/venue/venueForms/VenueDetailForm"
import { VenueImageEdit } from "@/components/venue/venueImage/VenueImageEditField"
import { VenueRegionForm } from "@/components/venue/venueForms/VenueRegionForm"
import { useRouter } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import { INITIAL_VENUE_UPDATE_DATA } from "@/lib/utils/common/const"
import { ForbiddenError } from "@/lib/utils/common/validations"
import {
  IFormErrors,
  validateVenueCreateForm,
} from "@/lib/utils/domain/validateVenue"
import { venueResponseForm } from "@/lib/utils/domain/venue.response.form"
import { syncGoogleVenueDetails } from "@/lib/utils/maps/googledetails"
import { updateVenueFromGoogle } from "@/lib/utils/maps/googlevenueupdate"
import { useAuthStore } from "@/store/auth-store"
import { IGetVenueBase } from "@/types/interfaces/interface.api"
import {
  IVenueAdminUpdateInput,
  Language,
  venueCategories,
} from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function EditvenueUpdateDataPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const venueId = params.id
  const locale = useLocale()
  const tr = useTranslations("venueUpdateDataPage")
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
  const [submitted, setSubmitted] = useState(false)
  const [formLoadError, setFormLoadError] = useState<string | null>(null)

  //User Authority
  const isAdmin = user?.role === "ADMIN"
  const isCreator = user?.id === (venue && venue.data?.createdBy) ? true : false
  const canEditName = isAdmin || isCreator
  const canEditCategory = isAdmin
  const canEditDescription = isAdmin
  const canEditImage = isAdmin || isCreator
  const canEditRegion = isAdmin
  const canEditVenueDetail = isAdmin

  const currentCoordinates =
    venueUpdateData.latitude && venueUpdateData.longitude
      ? { lat: venueUpdateData.latitude, lng: venueUpdateData.longitude }
      : null
  const { phoneNumber, priceRange, websiteUrl, workHour, ...venueBaseData } =
    venueUpdateData
  //locale과 다른 언어의 이름을 추가할수 있음, 관련 DTO도 create와는 다르게 I18nText
  const venuePayload = {
    ...venueBaseData,
    name: { [venueUpdateData.language]: venueUpdateData.name },
    description: { [venueUpdateData.language]: venueUpdateData.description },
  }

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
      if (processedResult.googlePlaceId) {
        syncGoogleVenueDetails(processedResult.googlePlaceId, {
          onVenueUpdate: (data: any) => {
            setVenueUpdateData((prev) => ({ ...prev, ...data }))
          },
          onDetailUpdate: (data: any) => {
            setVenueUpdateData((prev) => ({ ...prev, ...data }))
          },
        })
      }
    }
  }

  //구글맵에서 직접 위치를 선택 (역지오코딩,구글맵 좌표->주소변환)
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
    const inputErrors = validateVenueCreateForm({
      venueData: venueUpdateData,
    })
    try {
      const response = await venueApi.updateVenue(venueId, venuePayload)
      await venueApi.venueUpdate(response.id, venueUpdateDataPayload)
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
                  center={currentCoordinates ?? undefined}
                  markerPosition={currentCoordinates}
                  onLocationSelect={handleMapClick}
                />
                {/*위치에 대한 내용 표시 */}
                <div className="text-sm text-gray-500 my-2">
                  {venueUpdateData.latitude && venueUpdateData.longitude ? (
                    <>
                      <p>
                        {`${countryName}, ${venueUpdateData.city} ${venueUpdateData.district} ${venueUpdateData.details}`}
                        <span>{tr("checkAddress")}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {tr("coordinates")}:{" "}
                        {venueUpdateData.latitude?.toFixed(6)},{" "}
                        {venueUpdateData.longitude?.toFixed(6)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 my-4">
                      {tr("noLocationSelected")}
                    </p>
                  )}
                </div>
              </div>
              {/*언어 및 기본사항 표시*/}
              <VenueBasicForm
                venueData={venueUpdateData}
                setVenueData={setVenueUpdateData}
                submitted={submitted}
                locale={locale}
                errors={errors}
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
                onDelete={(url) =>
                  setImageUrls((prev) => prev.filter((item) => item !== url))
                }
              />
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
