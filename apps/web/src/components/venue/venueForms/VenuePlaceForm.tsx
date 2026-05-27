import { KakaoPlaceSearch } from "@/components/common/maps/KakaoPlaceSearch"
import MapPicker from "@/components/common/maps/MapPicker"
import { PlaceAutoComplete } from "@/components/common/maps/PlaceAutoComplete"
import { IKakaoPlaceSelected } from "@/types/maps/kakao"
import { SelectSearchType } from "@/types/types"
import { IVenueAdminUpdateInput } from "@triptags/shared"
import { useTranslations } from "next-intl"

interface IVenuePlaceData extends Pick<
  IVenueAdminUpdateInput,
  "latitude" | "longitude" | "country" | "city" | "district" | "details"
> {}

interface IVenuePlaceDetailData extends Pick<
  IVenueAdminUpdateInput,
  "phoneNumber" | "priceRange" | "websiteUrl" | "workHour"
> {}

export interface IVenuePlaceProps<T extends IVenuePlaceData> {
  venueData: T
  searchType: string
  setSearchType: React.Dispatch<React.SetStateAction<SelectSearchType>>
  countryName: string
  handleKaKaoPlaceSelected: (place: IKakaoPlaceSelected) => void
  handleGooglePlaceSelected: (place: google.maps.places.PlaceResult) => void
  setCountryName: React.Dispatch<React.SetStateAction<string>>
  handleMapClick: (location: { lat: number; lng: number }) => void
  handleReset: () => void
  canEditMap: boolean
}

export function VenuePlaceForm<T extends IVenuePlaceData>({
  searchType,
  setSearchType,
  venueData,
  countryName,
  handleKaKaoPlaceSelected,
  handleGooglePlaceSelected,
  handleMapClick,
  handleReset,
  canEditMap,
}: IVenuePlaceProps<T>) {
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")
  const currentCoordinates =
    venueData.latitude && venueData.longitude
      ? { lat: venueData.latitude, lng: venueData.longitude }
      : null

  return (
    <>
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {tr("searchPlace")}
        </label>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setSearchType("kakao")}
            disabled={!canEditMap}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === "kakao"
                ? "bg-yellow-400 text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tr("Kakao")}
          </button>
          <button
            type="button"
            onClick={() => setSearchType("google")}
            disabled={!canEditMap}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === "google"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tr("Google")}
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
          {searchType === "kakao" ? tr("kakaoHint") : tr("searchHint")}
        </p>
      </div>
      {/* map 구현*/}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-lg font-medium text-gray-700">
            {tr("selectOnMap")}
          </label>
          {venueData.latitude && venueData.longitude && (
            <button
              type="button"
              onClick={handleReset}
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
    </>
  )
}
