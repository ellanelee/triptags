"use client"
import { useRouter } from "@/i18n/routing"
import { reviewApi } from "@/lib/api/review.api"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { IGetReviewByVenueAllResponse } from "@/types/interfaces/interface.api"
import { ReviewFilterType } from "@triptags/shared"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { ReviewCard } from "./ReveiwCard"

export function ReviewList({ venueId }: { venueId: string }) {
  const reviews = useAsync<IGetReviewByVenueAllResponse>(null)
  const tr = useTranslations("ReviewList")
  const router = useRouter()
  const [reviewFilter, setReviewFilter] = useState<ReviewFilterType>("ALL")
  const reviewPageInfo = { groupSize: 10, items: 9 }
  const { isAuthenticated, user } = useAuthStore()
  const reviewList = reviews.data?.items ?? []

  //function fetch review
  const fetchReviews = () => {
    if (!venueId) return
    reviews.run(() =>
      reviewApi.getReviewByVenueId(venueId, {
        page: 1,
        items: reviewPageInfo.items,
        filter: reviewFilter,
      }),
    )
  }

  useEffect(() => {
    console.log("REVIEW FILTER:", reviewFilter)
    fetchReviews()
  }, [venueId, reviewPageInfo.items, reviewFilter])

  console.log(reviews)
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{tr("reviews")}</h2>
        {isAuthenticated && (
          <button
            onClick={() => router.push(`/venues/${venueId}/review/new`)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {tr("writeReview")}
          </button>
        )}
      </div>

      {/* Review Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setReviewFilter("ALL")}
          className={`px-4 py-2 rounded-md transition-colors ${
            reviewFilter === "ALL"
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
        {reviewList.length === 0 ? (
          <p className="text-center text-gray-600 py-8">{tr("noReviews")}</p>
        ) : (
          reviews.data?.items.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              venueId={venueId}
              userId={user?.id ?? ""}
              userNickname={user?.nickname ?? ""}
              onRefresh={fetchReviews}
            />
          ))
        )}
      </div>
    </div>
  )
}
