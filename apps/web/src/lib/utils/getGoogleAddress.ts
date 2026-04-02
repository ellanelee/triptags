import { IParsedGeocodeAddress } from "@/types/maps/google"
import { isNotFoundError } from "next/dist/client/components/not-found"

//googleGeoCodeAddress의 내용을 받아 내용 추출
private function getAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  valueType: "long_name" | "short_name" = "long_name",
) {
  const found = components.find((component) => component.types.includes(type))
  return found?.[valueType] ?? ""
}

//Address Parse
export function parseGeoCodeAddress(params: {
  result: google.maps.GeocoderResult
  localeCountryName: (code: string, locale: string) => string
  locale: string
}):IParsedGeocodeAddress {
  const { result, localeCountryName, locale } = params
  const components = result.address_components ?? []

  //국가 코드와 국가명 (country, admin_level1,
  const countryCode =
    getAddressComponent(components, "country", "short_name") || "KR"

  const country =
    localeCountryName(countryCode, locale) ||
    getAddressComponent(components, "country", "long_name")

  //광역행정구역
  const adminLevel1 = getAddressComponent(
    components,
    "administratative_area_level_1",
  )
  const locality = getAddressComponent(components, "locality")

  //소단위 행정구역
  const adminLevel2 = getAddressComponent(
    components,
    "administratative_area_level_2",
  )

  const sublocalityLevel1 = getAddressComponent(
    components,
    "sublocality_level_1",
  )
  const sublocalityLevel2 = getAddressComponent(
    components,
    "sublocality_level_2",
  )

  const neighborhood = getAddressComponent(components, "neighborhood")
  const route = getAddressComponent(components, "route")
  const streetNumber = getAddressComponent(components, "street_number")
  const premise = getAddressComponent(components, "premise")
  const subpremise = getAddressComponent(components, "subpremise")

  const city =
    countryCode === "KR"
      ? adminLevel1 || locality || ""
      : locality || adminLevel1 || ""

  const district =
    countryCode === "KR"
      ? sublocalityLevel1 || adminLevel2 || ""
      : adminLevel2 || sublocalityLevel1 || neighborhood || ""

const detailCandidates =
   countryCode === "KR"
   ? [sublocalityLevel2, route, streetNumber, premise, subpremise]
    : [neighborhood, route, streetNumber, premise, subpremise]

const details = Array.from(new Set(detailCandidates.filter(Boolean))).join(" ")

  return {
    countryCode,
    country : country,
    city: city,
    district: district,
    details: details,
  }
}

