import { IVenueCreate, IVenueDetailInput, IVenueSearchFilters } from "@triptags/shared";

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

export const INTITIAL_VENUE_FILTER: IVenueSearchFilters = ({
    search: "",
    category: null,
    city: "",
    district: "",
    tags: [],
    rating: null,
    sortBy: "recent"
  })

export const INITIAL_ISELECT_REVIEW = ({
  userId: null, 
  reviewId: null
})