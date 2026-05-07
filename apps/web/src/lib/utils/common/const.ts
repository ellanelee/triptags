import type {
  IVenueAdminUpdate,
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
  sortBy: "recent",
}

export const INITIAL_ISELECT_REVIEW = {
  userId: null,
  reviewId: null,
}

export const INITIAL_VENUE_UPDATE_DATA: IVenueAdminUpdate = {
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
}

export const INITIAL_VENUE_UPDATE: IVenueAdminUpdate = {
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
  venueImage:[]
}