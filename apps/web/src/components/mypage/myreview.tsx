"use client"
import { useEffect } from "react"
import { reviewApi } from "@/lib/api/review.api"
import { IUserReview } from "@triptags/shared"
import { useAsync } from "@/lib/hooks/use.async"
import { useLocale, useTranslations } from "next-intl"
import { useAuthStore } from "@/store/auth-store"

export default function MyReview() {
  const myReviews = useAsync<IUserReview[] | null>(null)
  const t = useTranslations("Common")
  const tr = useTranslations("MyReview")
  const { user } = useAuthStore()
  const locale = useLocale()

  useEffect(() => {
    myReviews.run(() => reviewApi.getReview(user?.id ?? ""))
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {tr("reviewTitle")}
        </h2>
      </div>
      <div className="grid gap-4 w-fulll">
        {myReviews?.data?.map((el) => (
          <div
            key={el.id}
            className="flex justify-between border px-10 border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex-1 flex items-center max-h-24 overflow-y-auto scrollbarhide pr-4">
              <p>{(el.contents as any)?.[locale] || ""}</p>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mx-4">
                <div className="mx-4">
                  {tr("rating")} : {el.rating},{" "}
                </div>
                <div className="mx-4">
                  {tr("reviewHelpful")} :{" "}
                  {el.reviewHelpful ? el.reviewHelpful : 0},
                </div>
                <div className="mx-4">
                  {t("transaction.createdAt")} :{" "}
                  {new Date(el.createdAt).toLocaleDateString("ko-Kr")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
