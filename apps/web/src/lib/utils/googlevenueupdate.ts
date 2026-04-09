import { parseGeoCodeAddress } from "./googleaddress"

interface IPatchVenueFromGoogle {
  country: string
  city: string
  district: string
  details: string
  countryName: string
}

export function patchVenueFromGoogle(
  result: google.maps.GeocoderResult | google.maps.places.PlaceResult,
  localeCountryName: (code: string, locale: string) => string,
  locale: string,
): IPatchVenueFromGoogle {
  const parsedResult = parseGeoCodeAddress({
    result: result as google.maps.GeocoderResult,
    localeCountryName,
    locale,
  })
  console.log("google.maps.GeocoderResult 파싱결과", parsedResult)
  return {
    country: parsedResult.countryCode,
    city: parsedResult.city,
    district: parsedResult.district,
    details: parsedResult.details,
    countryName: parsedResult.countryName,
  }
}
