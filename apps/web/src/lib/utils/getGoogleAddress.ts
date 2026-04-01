import { stringify } from "querystring"
import { localeCountryName } from "./country"
import { IParsedGeocodeAddress } from "@/types/maps/google"

async function getAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  valueType: "long_name" | "short_name" = "long_name",
) {
  const found = components.find((component) => component.types.includes(type))
  return found?.[valueType] ?? ""
}

export async function parseGeoCodeAddress(params: {
  result: google.maps.GeocoderResult
  localeCountryName: (code: string, locale: string) => string
  locale: string
}): IParsedGeocodeAddress {
  const { result, localeCountryName, locale } = params
  const components = result.address_components ?? []

  const countryCode =
    (await getAddressComponent(components, "country", "short_name")) || "KR"
  const country =
    localeCountryName(countryCode, locale) ||
    getAddressComponent(components, "country", "long_name") ||
    countryCode
  const adminLevel1 = getAddressComponent(
    components,
    "administratative_area_level_1",
  )
  const locality = getAddressComponent(components, "locality")
  const adminLevel2 = getAddressComponent(
    components,
    "administratative_area_level_2",
  )
  const sublocalityLevel1 = getAddressComponent(
    components,
    "sublocality_level_1",
  )
  const neighborhood = getAddressComponent(components, "neighborhood")
  const route = getAddressComponent(components, "route")
  const streetNumber = getAddressComponent(components, "street_number")
  const premise = getAddressComponent(components, "premise")
  const subpremise = getAddressComponent(components, "subpremise")
  const postalCode = getAddressComponent(components, "postal_code")

}
