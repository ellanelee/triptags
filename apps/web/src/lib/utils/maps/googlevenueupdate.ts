import { CountryUtils } from "../domain/country.utils"
import { parseGeoCodeAddress } from "./googleaddress"

interface IUpdateVenueFromGoogle {
  latitude: number
  longitude: number
  country: string
  city: string
  district: string
  details: string
  countryName: string
  googlePlaceId?: string
}

//구글에서 가져온 징소객채정보를 place정보를 페이지 내부에 설정

export const updateVenueFromGoogle = (
  result: google.maps.GeocoderResult | google.maps.places.PlaceResult,
  locale: string,
): IUpdateVenueFromGoogle | null => {
  if (!result.geometry?.location) return null

  const lat = result.geometry.location.lat()
  const lng = result.geometry.location.lng()
  const placeId = result.place_id

  const parsedResult = parseGeoCodeAddress({
    result: result as google.maps.GeocoderResult,
    localeCountryName: CountryUtils.getCountryName,
    locale,
  })

  const { countryCode, city, district, details, countryName } = parsedResult
  return {
    latitude: lat,
    longitude: lng,
    country: countryCode,
    city,
    district,
    details,
    googlePlaceId: placeId,
    countryName,
  }
}
