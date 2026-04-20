import { IVenueCreate, IVenueDetailInput } from "@triptags/shared";

export const venueCategories = [
  "RESTAURANT",
  "CAFE",
  "HOTEL",
  "STREET_FOOD",
  "BAR",
  "ATTRACTION",
  "ACTIVITY",
  "SHOPPING",
  "NATURE",
  "CULTURE",
] as const

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
};

export const INITIAL_VENUE_DETAIL: IVenueDetailInput = {
  phoneNumber: "",
  priceRange: "",
  subCategory: "",
  websiteUrl: "",
  workHour: ""
};