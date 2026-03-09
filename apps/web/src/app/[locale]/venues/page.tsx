"use client"
import { Link } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import type { VenueCategory } from "@triptags/shared"
import { venueCategories } from "@/components/common/const"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { IGetVenueAllResponse } from "@/types/interfaces/interface.api"
import PageGroups from "@/components/common/pages/PageGroups"
import { PageProps } from "@/types/interfaces/interface.props"

export default function VenuePage() {
  const tr = useTranslations("VenuesPage")
  const t = useTranslations("Common")
  const pageInfo = { groupSize: 10, items: 9 }
  const locale = useLocale()
  const venues = useAsync<IGetVenueAllResponse>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(1)
  const [filters, setFilters] = useState({
    category: "" as VenueCategory | "",
    city: "",
    district: "",
    search: "",
    sortBy: "recent" as "rating" | "reviews" | "recent" | "distance",
  })

  useEffect(() => {
    venues.run(() =>
      venueApi.getAllVenue({ page: currentPage, items: pageInfo.items }),
    )
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageGroupChange = (newPageGroup: number) => {
    const pageGroup = Math.floor(currentPage / pageInfo.groupSize)
    setCurrentPage(pageGroup)
  }

  const {
    hasNextPage,
    hasPrevPage,
    page: CurrentPage,
    totalCount,
    totalPage,
  } = venues.data?.meta ?? {
    hasNextPage: false,
    hasPrevPage: false,
    totalCount: 0,
    totalPage: 0,
  }
  const pageProps: PageProps = {
    groupSize: 10,
    totalCount,
    currentPage,
    totalPage,
    hasNextPage,
    hasPrevPage,
    onPageChange: handlePageChange,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {tr("title")}
          </h1>
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={tr("searchPlaceholder")}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter - Button Style */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {tr("category")}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, category: "" })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filters.category === ""
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tr("allCategories")}
            </button>
            {venueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setFilters({ ...filters, category: cat as VenueCategory })
                }
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filters.category === cat
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>
        {/* Additional Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {tr("city")}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={tr("cityPlaceholder")}
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
              />
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {tr("district")}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={tr("cityPlaceholder")}
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
              />
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {tr("sortBy")}
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as
                      | "rating"
                      | "reviews"
                      | "recent"
                      | "distance",
                  })
                }
              >
                <option value="recent">{tr("sort.recent")}</option>
                <option value="rating">{tr("sort.rating")}</option>
                <option value="reviews">{tr("sort.reviews")}</option>
                <option value="reviews">{tr("sort.distance")}</option>
              </select>
            </div>
          </div>
        </div>
        {/* Venue List */}
        <div className="m-4 text-xl">
          {totalCount} {tr("total")}
        </div>
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
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {venue.venueImages[0] ? (
                    <img
                      src={venue.venueImages[0].imageUrl}
                      alt={
                        typeof venue.name === "string"
                          ? venue.name[locale]
                          : venue.name.ko
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                      {t(`categories.${venue.venueCategory}`)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {typeof venue.name === "string"
                      ? venue.name
                      : venue.name[locale]}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {venue.region.parent?.name}
                    {venue.region && `, ${venue.region.name}`}
                  </p>

                  {/* Overall Rating */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                      <span className="text-yellow-500 mr-1 text-lg">★</span>
                      <span className="font-bold text-gray-900">
                        {venue.venueStats?.ratingAvg}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {tr("reviewsCount", {
                        count: venue.venueStats?.reviewCount || 0,
                      })}
                    </span>
                  </div>

                  {/* Local vs Traveler Ratings */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <div className="text-xs font-semibold text-emerald-700 mb-1">
                        Local
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-emerald-900">
                          {/* {venue.localAvgRating || 0} */}
                        </span>
                        <span className="text-xs text-emerald-600">
                          {/* ({venue.localReviewCount || 0}) */}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-xs font-semibold text-blue-700 mb-1">
                        Traveler
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-blue-900">
                          {/* {venue.travelerAvgRating || 0} */}
                        </span>
                        <span className="text-xs text-blue-600">
                          {/* ({venue.travelerReviewCount || 0}) */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <div className="col-span-full mt-8 flex justify-center">
              <PageGroups {...pageProps} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
