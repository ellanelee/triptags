import { Link } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import {
  IUserPointAll,
  VenueCategory,
  VenuePaginationDto,
} from "@triptags/shared"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function VenuePage() {
  const tr = useTranslations("VenuePage")
  const venues = useAsync<VenuePaginationDto[] | null>(null)
  const [filters, setFilters] = useState({
    category: "" as VenueCategory | "",
    city: "",
    district: "",
    search: "",
    sortBy: "recent" as "rating" | "reviews" | "recent" | "distance",
  })

  useEffect(() => {
    venues.run(() => venueApi.getAllVenue({ page: 1, items: 10 }))
  }, [])

  const handlePageChange = (newPage: number) => {
    venues.run(() => venueApi.getAllVenue({ page: newPage, items: 10 }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {tr("title")}
          </h1>
        </div>
      </div>
    </div>
  )
}
