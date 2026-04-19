"use client"
import { useRouter } from "@/i18n/routing"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { venueApi } from "@/lib/api/venue.api"
import {
  IGetReviewByVenueAllResponse,
  IGetVenueBase,
} from "@/types/interfaces/interface.api"
import { reviewApi } from "@/lib/api/review.api"
import { Language } from "@triptags/shared"

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
  const { isAuthenticated, user } = useAuthStore()
  const [currentImage, setCurrentImage] = useState(0)
  const venue = useAsync<IGetVenueBase>(null)
  const reviews = useAsync<IGetReviewByVenueAllResponse>(null)
  const [reviewFilter, setReviewFilter] = useState<"all" | "LOCAL" | "USER">(
    "all",
  )
  const reviewPageInfo = { groupSize: 10, items: 9 }
  const [selectReview, setSelectReview] = useState<{
    userId: string
    reviewId: string
  } | null>(null)

  useEffect(() => {
    venue.run(() => venueApi.getVenueById(venueId))
  }, [])

  useEffect(() => {
    reviews.run(() =>
      reviewApi.getReviewByVenueId(venueId, {
        page: 1,
        items: reviewPageInfo.items,
      }),
    )
  }, [venueId, reviewPageInfo.items])

  const handleEditReview = async () => {
    if (!selectReview || !venue.data?.id) return
    router.replace(`/venues/${venue.data.id}/review/${selectReview.reviewId}`)
  }
  const handleDeleteReview = async () => {
    if (!selectReview) return
    const ok = window.confirm("리뷰를 삭제하시겠습니까?")
    if (!ok) return
    try {
      await reviewApi.deleteReview(selectReview.reviewId)
      setSelectReview(null)
      await reviews.run(() =>
        reviewApi.getReviewByVenueId(venueId, {
          page: 1,
          items: 9,
        }),
      )
    } catch (error) {
      console.error("삭제 실패", error)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upper Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {venue.data?.name ? venue.data?.name[locale] : ""}
          </h1>
          <p className="text-lg text-gray-600">
            {venue.data?.region?.parent?.name}
            {venue.data?.region && `, ${venue.data.region.name}`}
          </p>

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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{tr("reviews")}</h2>
                {isAuthenticated && (
                  <button
                    onClick={() => router.push(`/venues/${venueId}/review`)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {tr("writeReview")}
                  </button>
                )}
              </div>

              {/* Review Filter */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    reviewFilter === "all"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tr("allReviews")}
                </button>
                <button
                  onClick={() => setReviewFilter("LOCAL")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    reviewFilter === "LOCAL"
                      ? "bg-local-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tr("localReviews")}
                </button>
                <button
                  onClick={() => setReviewFilter("USER")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    reviewFilter === "USER"
                      ? "bg-traveler-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tr("travelerReviews")}
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.data?.items.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    {tr("noReviews")}
                  </p>
                ) : (
                  reviews.data?.items.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-col item-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium mx-2">
                              {review.user.nickname}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-yellow-500">
                                {"★".repeat(review.rating)}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                              {review.localVerificationId && (
                                <span className="px-2 py-1 bg-green-50 text-local-700 text-xs rounded-full">
                                  Local
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2 mx-2">
                            {typeof review.contents === "string"
                              ? review.contents
                              : review.contents[locale]}
                          </p>
                        </div>
                        <div className="relative">
                          {review.userId === user?.id && (
                            <button
                              onClick={() => {
                                setSelectReview({
                                  userId: user.id,
                                  reviewId: review.id,
                                })
                              }}
                            >
                              ...
                            </button>
                          )}
                          {selectReview?.reviewId === review.id && (
                            <div className="absolute left-1/2 top-5 z-20 w-28 -translate-x-1/2 rounded-xl border border-gray-200 flex flex-col my-4 bg-white shadow-lg">
                              <button
                                className="text-sm py-2 text-gray-800 hover:bg-gray-100"
                                onClick={() => handleEditReview()}
                              >
                                수정
                              </button>
                              <button
                                className="text-sm py-2 text-gray-800 hover:bg-gray-100"
                                onClick={() => handleDeleteReview()}
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Image Section*/}
            <div className="mb-6 overflow-hidden rounded-xl bg-gray-200 shadow-sm relative group"></div>
            {(venue.data?.venueImages ?? []).length> 0 ? (
            <div>
              <img src={venue.data?.venueImages[currentImage].imageUrl}
            </div>
            ):()}
            {/* Info */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">{tr("information")}</h3>
              <div className="space-y-3">
                {venue.data?.venueDetail?.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-600">{tr("phone")}</p>
                    <p className="font-medium">
                      {venue.data?.venueDetail?.phoneNumber}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">{tr("address")}</p>
                  <span className="font-medium">
                    {venue.data?.region?.parent?.name}
                  </span>
                  <span className="font-medium">
                    {venue.data?.region && `, ${venue.data.region.name}`}
                  </span>
                  <span className="font-medium">
                    {venue.data?.detailedAddress}
                  </span>
                </div>
                {venue.data?.venueDetail?.priceRange && (
                  <div>
                    <p className="text-sm text-gray-600">{tr("priceRange")}</p>
                    <p className="font-medium text-lg">
                      {venue.data.venueDetail.priceRange}
                    </p>
                  </div>
                )}
                {venue.data?.venueDetail?.websiteUrl && (
                  <div>
                    <p className="text-sm text-gray-600">{tr("website")}</p>
                    <a
                      href={venue.data?.venueDetail?.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {tr("visitWebsite")}
                    </a>
                  </div>
                )}
              </div>
            </div>
            {/* External Map Links */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <a
                href={`https://map.kakao.com/link/map/${encodeURIComponent(venue.data?.name?.[locale])},${venue.data?.latitude},${venue.data?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-yellow-400 text-black text-center rounded-md hover:bg-yellow-500 transition-colors"
              >
                카카오맵에서 보기
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${venue.data?.latitude},${venue.data?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 transition-colors"
              >
                구글맵에서 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
