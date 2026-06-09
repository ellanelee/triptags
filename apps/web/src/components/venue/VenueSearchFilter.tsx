"use client"

import { IVenueSearchFilters, venueCategories, VenueCategory } from "@triptags/shared"
import { useTranslations } from "next-intl"
import BasicButton from "../common/button/BasicButton"
import { useState } from "react"

interface IVenueSearchFilterProps {
  initialFilters: IVenueSearchFilters
  onSubmitSearch: (filters: IVenueSearchFilters) => void
  onReset: () => void
}

export default function VenueSearchFilter({
  initialFilters,
  onSubmitSearch,
  onReset,
}: IVenueSearchFilterProps) {
  const tr = useTranslations("VenuesPage")
  const t = useTranslations("Common")
  const [localFilters, setLocalFilters] = useState(initialFilters)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmitSearch(localFilters)
  }

  const handleReset = () => {
    onReset()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Header with Search */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {tr("title")}
            </h1>
            {/* Search Bar */}
            <div className="border border-gray-100 bg-gray-50">
              <div className="relative m-4">
                <input
                  type="text"
                  className="w-full border-2 bg-white border-gray-300 rounded-lg px-5 py-4 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={tr("searchPlaceholder")}
                  value={localFilters.search}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, search: e.target.value })
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
              {/* Category Filter - Button Style */}
              <div className="p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-500 mb-4">
                  {tr("category")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setLocalFilters({ ...localFilters, category: "" })
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      localFilters.category === ""
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tr("allCategories")}
                  </button>
                  {venueCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() =>
                        setLocalFilters({
                          ...localFilters,
                          category: cat as VenueCategory,
                        })
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        localFilters.category === cat
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-6">
                {/* Country Filter */}
                <div>
                  <label className="block text-lg font-semibold text-gray-500 mb-2">
                    {tr("country")}
                  </label>
                  <input
                    type="text"
                    className="w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={tr("countryPlaceholder")}
                    value={localFilters.country}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        country: e.target.value,
                      })
                    }
                  />
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-lg font-semibold text-gray-500 mb-2">
                    {tr("city")}
                  </label>
                  <input
                    type="text"
                    className="w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={tr("cityPlaceholder")}
                    value={localFilters.city}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, city: e.target.value })
                    }
                  />
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-lg font-semibold text-gray-500 mb-2">
                    {tr("district")}
                  </label>
                  <input
                    type="text"
                    className="w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={tr("cityPlaceholder")}
                    value={localFilters.district}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        district: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-lg font-semibold text-gray-500 mb-2">
                    {tr("rating")}
                  </label>
                  <select
                    className="w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={Number(localFilters.rating)}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">전체</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-lg font-semibold text-gray-500 mb-2">
                    {tr("sortBy")}
                  </label>
                  <select
                    className="w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={localFilters.sortBy}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
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
                    <option value="distance">{tr("sort.distance")}</option>
                  </select>
                </div>
                <div className="flex">
                  <BasicButton className="mt-7 w-full mx-2" type="submit">
                    {tr("submitSearchForm")}
                  </BasicButton>
                  <BasicButton
                    className="mt-7 w-full mx-2"
                    type="button"
                    onClick={handleReset}
                  >
                    {t("transaction.reset")}
                  </BasicButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
