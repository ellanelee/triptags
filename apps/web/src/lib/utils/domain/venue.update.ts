import { IGetVenueBase } from "@/types/interfaces/interface.api"
import {
  IVenueAdminUpdate,
  Language,
  VenueCategory,
} from "@triptags/shared"
import { requiredString, requiredValue } from "../common/validations"

export function venueResponseForm(
  venue: IGetVenueBase,
  language: Language,
): IVenueAdminUpdate {

  return {
    language,
    name: requiredString(venue.name?.[language], "No_Venue_Name"),
    description: requiredString(
      venue.description?.[language],
      "No_Venue_Description",
    ),
    venueCategory: requiredValue<VenueCategory>(
      venue.venueCategory,
      "No_Category_Information",
    ),
    country: requiredString(
      venue.region.parent?.parent?.name,
      "No_Country_Information",
    ),
    city: requiredString(venue.region.parent?.name, "No_City_Information"),
    district: requiredString(venue.region.name, "No_District_Information"),
    details: requiredString(venue.detailedAddress, "No_Detail_Address"),
    phoneNumber: venue.venueDetail?.phoneNumber ?? undefined,

    priceRange: venue.venueDetail?.priceRange ?? undefined,
    websiteUrl: venue.venueDetail?.websiteUrl ?? undefined,
    latitude: requiredValue<number>(venue.latitude, "No_Position_Info"),
    longitude: requiredValue<number>(venue.longitude, "No_Position_Info"),
    googlePlaceId: venue.googlePlaceId ?? undefined,
  }
}
