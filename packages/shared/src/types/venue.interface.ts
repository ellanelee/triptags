import { VenueCategory } from "src/common/types";


export interface VenueSearchFilters {
  search?: string;
  city?: string;
  district?: string;
  category?: VenueCategory;
  tags?: string[];
  rating?: number;
  sortBy?: SortBy
}

export type SortBy = 'rating' | 'reviews' | 'recent' | 'distance';