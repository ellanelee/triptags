import { useAuthStore } from "@/store/auth-store"
import { IReviewCardProps } from "@/types/interfaces/interface.props"
import { useLocale } from "next-intl"

export function ReviewCard({
  review,
  setSelectReview,
}: IReviewCardProps) {

  const locale = useLocale()
  const { user } = useAuthStore()

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
        </div>
      </div>
    </div>
  )
}
