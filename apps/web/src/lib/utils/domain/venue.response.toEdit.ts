import { IGetVenueBase } from "@/types/interfaces/interface.api"
import {
  IVenueAdminUpdateInput,
  Language,
  VenueCategory,
} from "@triptags/shared"
import { requiredString, requiredValue } from "../common/validations"

export function venueResponseToEditForm(
  venue: IGetVenueBase,
  language: Language,
): IVenueAdminUpdateInput {
  return {
    language,
    name: venue.name?.[language] ?? "",
    description: venue.description?.[language] ?? "",
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
    latitude: requiredValue<number>(venue.latitude, "No_Position_Info"),
    longitude: requiredValue<number>(venue.longitude, "No_Position_Info"),
    googlePlaceId: venue.googlePlaceId ?? undefined,
    venueImage: venue.venueImages,

    phoneNumber: venue.venueDetail?.phoneNumber ?? undefined,
    priceRange: venue.venueDetail?.priceRange ?? undefined,
    websiteUrl: venue.venueDetail?.websiteUrl ?? undefined,
    workHour: venue.venueDetail?.workHour?.[language] ?? "",
  }
}
