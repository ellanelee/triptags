"use client"
import { useRouter } from "@/i18n/routing"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { venueApi } from "@/lib/api/venue.api"
import { IGetVenueBase } from "@/types/interfaces/interface.api"
import type { Language } from "@triptags/shared"
import VenueImageManager from "@/components/venue/venueImage/VenueImageManager"
import BasicButton from "@/components/common/button/BasicButton"
import { ReviewList } from "@/components/review/ReviewList"

export default function VenueDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const venueId = params.id
  const router = useRouter()
  const tr = useTranslations("VenueDetailPage")
  const t = useTranslations("Common")
  const locale = useLocale() as Language
  const { user } = useAuthStore()
  const venue = useAsync<IGetVenueBase>(null)
  const isAdmin = user?.role === "ADMIN"
  const isCreator = user?.id === venue.data?.createdBy

  //Venue설정값 불러오기
  useEffect(() => {
    venue.run(() => venueApi.getVenueById(venueId))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upper Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {venue.data?.name ? venue.data?.name[locale] : ""}
              </h1>
              <p className="text-lg text-gray-600">
                {venue.data?.region?.parent?.name}
                {venue.data?.region && `, ${venue.data.region.name}`}
              </p>
            </div>
            {/* Venue Detail Information Edit Exposure */}
            {(isAdmin || isCreator) && (
              <div className="m-6 overflow-hidden rounded-xl relative group">
                <BasicButton
                  onClick={() => router.push(`/venues/${venueId}/edit`)}
                  className="px-5 py-2.5 whitespace-nowrap"
                >
                  {t("transaction.edit")}
                </BasicButton>
              </div>
            )}
          </div>

          {/* Ratings Summary */}
          <div className="mt-6 flex flex-wrap gap-6">
            {/* Overall Rating */}
            <div className="bg-gray-50 px-6 py-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {tr("overallRating")}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {venue.data?.venueStats?.ratingAvg?.toFixed(1) || 0}
                </span>
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-sm text-gray-500">
                  ({venue.data?.venueStats?.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Local Rating */}
            <div className="bg-local-50 px-6 py-4 rounded-lg border border-local-200">
              <p className="text-sm text-local-700 font-medium mb-1">
                {tr("localRating")}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-local-700">
                  {venue.data?.reviewSummary.local.averageRating.toFixed(1)}
                </span>
                <span className="text-local-500 text-2xl">★</span>
                <span className="text-sm text-local-600">
                  ({venue.data?.reviewSummary.local.count})
                </span>
              </div>
            </div>

            {/* Traveler Rating */}
            <div className="bg-traveler-50 px-6 py-4 rounded-lg border border-traveler-200">
              <p className="text-sm text-traveler-700 font-medium mb-1">
                {tr("travelerRating")}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-traveler-700">
                  {venue.data?.reviewSummary.normal.averageRating.toFixed(1)}
                </span>
                <span className="text-traveler-500 text-2xl">★</span>
                <span className="text-sm text-traveler-600">
                  ({venue.data?.reviewSummary.normal.count})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {venue.data?.description && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{tr("about")}</h2>
                <p className="text-gray-700">
                  {venue.data?.description
                    ? venue.data?.description[locale]
                    : ""}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <ReviewList venueId={venue.data?.id ?? ""} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Image Section*/}
            <div className="mb-6 overflow-hidden rounded-xl bg-gray-200 shadow-sm relative group">
              <VenueImageManager
                venueImages={venue.data?.venueImages ?? []}
                venueId={venue.data?.id ?? ""}
                canEdit={isCreator || isAdmin}
              />
            </div>
            {/* Info */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">{tr("information")}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{tr("address")}</p>
                  <span className="font-medium">
                    {venue.data?.region?.parent?.name}
                  </span>
                  <span className="font-medium">
                    {venue.data?.region && `, ${venue.data.region.name} `}
                  </span>
                  <span className="font-medium">
                    {venue.data?.detailedAddress}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{tr("phone")}</p>
                  <p className="font-medium">
                    {venue.data?.venueDetail?.phoneNumber ?? tr("noPhone")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{tr("priceRange")}</p>
                  <p className="font-medium text-lg">
                    {venue.data?.venueDetail?.priceRange ?? tr("noPrice")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{tr("website")}</p>
                  {venue.data?.venueDetail?.websiteUrl ? (
                    <span className="font-medium text-lg">
                      <a
                        href={venue.data?.venueDetail?.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {venue.data.venueDetail.websiteUrl}
                        {tr("visitWebsite")}
                      </a>
                    </span>
                  ) : (
                    <span>{tr("noWebsite")}</span>
                  )}
                </div>
              </div>
            </div>
            {/* External Map Links */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              {venue.data?.name?.[locale] && (
                <a
                  href={`https://map.kakao.com/link/map/${encodeURIComponent(venue.data?.name?.[locale])},${venue.data?.latitude},${venue.data?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-yellow-400 text-black text-center rounded-md hover:bg-yellow-500 transition-colors"
                >
                  {venue.data?.name?.[locale]} {tr("checkwithKaKaoMap")}
                </a>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${venue.data?.latitude},${venue.data?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 transition-colors"
              >
                {venue.data?.name?.[locale]} {tr("checkwithGoogleMap")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
