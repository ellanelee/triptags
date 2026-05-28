"use client"
import { useRouter } from "@/i18n/routing"
import { reviewApi } from "@/lib/api/review.api"
import { useAuthStore } from "@/store/auth-store"
import { IReviewCardProps } from "@/types/interfaces/interface.props"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

export function ReviewCard({
  review,
  venueId,
  userId,
  userNickname,
  onRefresh,
}: IReviewCardProps) {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("Common")
  const [showEditOption, setShowEditOption] = useState(false)

  console.log(review)
  console.log("ReviewCard Start")
  const handleEditReview = async () => {
    if (!review || !venueId) return
    router.replace(`/venues/${venueId}/review/${review.id}/edit`)
  }
  const handleDeleteReview = async () => {
    if (!userId || !review.id) return
    const reconfirm = window.confirm("리뷰를 삭제하시겠습니까?")
    if (!reconfirm) return
    try {
      await reviewApi.deleteReview(review.id)
      onRefresh()
    } catch (error) {
      console.error("삭제 실패", error)
    }
  }
  return (
    <div
      key={review.id}
      className="border-b border-gray-200 pb-6 last:border-0"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col item-center">
          <div className="flex items-center gap-2">
            <span className="font-medium mx-2">{review.user.nickname}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500">
                {"★".repeat(review.rating)}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
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
          {review.userId === userId && (
            <button
              onClick={() => {
                setShowEditOption(true)
              }}
            >
              ...
            </button>
          )}
          {showEditOption && (
            <div className="absolute left-1/2 top-5 z-20 w-28 -translate-x-1/2 rounded-xl border border-gray-200 flex flex-col my-4 bg-white shadow-lg">
              <button
                className="text-sm py-2 text-gray-800 hover:bg-gray-100"
                onClick={handleEditReview}
              >
                {t("transaction.edit")}
              </button>
              <button
                className="text-sm py-2 text-gray-800 hover:bg-gray-100"
                onClick={handleDeleteReview}
              >
                {t("transaction.delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
