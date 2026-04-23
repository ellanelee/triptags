"use client"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import type { Language } from "@triptags/shared"
import { INTITIAL_VENUE_FILTER } from "@/components/common/const"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { IGetVenueAllResponse } from "@/types/interfaces/interface.api"
import PageGroups from "@/components/common/pages/PageGroups"
import { PageProps } from "@/types/interfaces/interface.props"
import VenueSearchFilter from "@/components/venue/VenueSearchFilter"
import VenueCard from "@/components/venue/VenueCard"

export default function VenuePage() {
  const tr = useTranslations("VenuesPage")
  const t = useTranslations("Common")
  const pageInfo = { groupSize: 10, items: 9 }
  const locale = useLocale() as Language
  const venues = useAsync<IGetVenueAllResponse>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filters, setFilters] = useState(INTITIAL_VENUE_FILTER)

  useEffect(() => {
    venues.run(() =>
      venueApi.getAllVenue({ page: currentPage, items: pageInfo.items }),
    )
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const totalCount = venues.data?.meta.totalCount ?? 0
  const totalPage = venues.data?.meta.totalPage ?? 0

  const pageProps: PageProps = {
    groupSize: 10,
    totalCount,
    currentPage,
    totalPage,
    onPageChange: handlePageChange,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VenueSearchFilter
        filters={filters}
        setFilters={setFilters}
      ></VenueSearchFilter>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue List */}
        <div className="m-4 text-xl">
          {totalCount} {tr("total")}
        </div>

        {/*API Responses */}
        {!venues.data ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg text-gray-600">{t("noResults")}</p>
            <p className="text-sm text-gray-500 mt-2">{t("noResultsHint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.data?.items.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
        <div className="col-span-full mt-8 flex justify-center">
          <PageGroups {...pageProps} />
        </div>
      </div>
    </div>
  )
}
