import type {
  IVenueAdminUpdateInput,
  IVenueCreate,
  IVenueDetailInput,
  IVenueSearchFilters,
} from "@triptags/shared"

export const INITIAL_VENUE_DATA: IVenueCreate = {
  language: "ko",
  name: "",
  description: "",
  venueCategory: null,
  latitude: null,
  longitude: null,
  country: "",
  city: "",
  district: "",
  details: "",
  googlePlaceId: "",
  venueImage: []
}

export const INITIAL_VENUE_DETAIL: IVenueDetailInput = {
  phoneNumber: "",
  priceRange: "",
  subCategory: "",
  websiteUrl: "",
  workHour: "",
}

export const INTITIAL_VENUE_FILTER: IVenueSearchFilters = {
  search: "",
  country: "",
  city: "",
  district: "",
  rating: 5,
  sortBy: "recent",
}

export const INITIAL_ISELECT_REVIEW = {
  userId: null,
  reviewId: null,
}

export const INITIAL_VENUE_UPDATE_DATA: IVenueAdminUpdateInput = {
  language: "ko",
  name: "",
  description: "",
  venueCategory: null,
  country: "",
  city: "",
  district: "",
  details: "",
  latitude: null,
  longitude: null,
  googlePlaceId: "",
  phoneNumber: "",
  priceRange: "",
  websiteUrl: "",
  venueImage: [],
}

export const INITIAL_VENUE_UPDATE: IVenueAdminUpdateInput = {
  language: "ko",
  name: "",
  description: "",
  venueCategory: null,
  country: "",
  city: "",
  district: "",
  details: "",
  latitude: null,
  longitude: null,
  googlePlaceId: undefined,
  phoneNumber: undefined,
  priceRange: undefined,
  websiteUrl: undefined,
  venueImage: [],
}
