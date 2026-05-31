"use client"
import LocalVerification from "@/components/common/local/LocalVerification"
import { useRouter } from "@/i18n/routing"
import { reviewApi } from "@/lib/api/review.api"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import { INITIAL_REVIEW_DATA } from "@/lib/utils/common/const"
import { localeMap } from "@/lib/utils/format/dateLocales"
import { useAuthStore } from "@/store/auth-store"
import { IGetVenueBase } from "@/types/interfaces/interface.api"
import type { Language, ReviewResponse, VisitPurpose } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"

export default function EditReviewPage({
  params,
}: {
  params: {
    id: string
    reviewId: string
  }
}) {
  const tr = useTranslations("CreateReviewPage")
  const t = useTranslations("Common")
  const router = useRouter()
  const locale = useLocale() as Language
  const venue = useAsync<IGetVenueBase | null>(null)
  const { isAuthenticated, user } = useAuthStore()
  const review = useAsync<ReviewResponse | null>(null)
  const [formData, setFormData] = useState<ReviewResponse>(INITIAL_REVIEW_DATA)
  const [loading, setLoading] = useState(false)
  const venueId = params.id
  const reviewId = params.reviewId
  const isCreator =
    !!user?.id && !!review.data && user.id === review.data?.userId
  const isAdmin = user?.role === "ADMIN"
  const canEditDescription = isAdmin || isCreator

  console.log(isCreator, isAdmin, canEditDescription)
  useEffect(() => {
    if (!isAuthenticated) {
      router.back()
    }
    review.run(() => reviewApi.getReviewById(reviewId))
  }, [isAuthenticated])

  useEffect(() => {
    if (!review.data) return
    if (!isCreator) {
      router.back()
    }
    setFormData({
      rating: review.data.rating,
      contents: review.data.contents,
      userId: review.data.userId,
      reviewDetail: {
        tasteRating: review.data.reviewDetail.tasteRating,
        serviceRating: review.data.reviewDetail.serviceRating,
        priceRating: review.data.reviewDetail.priceRating,
        visitDate: review.data.reviewDetail.visitDate,
        visitPurpose: review.data.reviewDetail.visitPurpose,
      },
    })
    venue.run(() => venueApi.getVenueById(venueId))
  }, [review.data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venue.data?.id || !user?.role) {
      alert("정보가 로드되지 않았습니다.")
      return
    }

    const { contents, ...rest } = formData
    setLoading(true)
    try {
      console.log(contents)
      const response = await reviewApi.updateReview(venue.data?.id, contents)
      console.log(response)
      router.push(`/venues/${params.id}`)
    } catch (error) {
      console.error("review 제출에러", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-2">{tr("title")}</h1>
          <p className="text-xl text-primary-600 font-bold mb-8">
            {venue.data?.name ? venue.data.name[locale] : ""}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {tr("rating")} *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!isAdmin}
                    value={formData.rating}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl focus:outline-none"
                  >
                    <span
                      className={
                        star <= formData.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {formData.rating}/5
                </span>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tr("content")} *
              </label>
              <textarea
                required
                disabled={!canEditDescription}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={tr("contentPlaceholder")}
                value={formData.contents[locale] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contents: {
                      ...formData.contents,
                      [locale]: e.target.value,
                    },
                  })
                }
              />
            </div>
            {/*reviewImage등록 및 표시, 세부 로직은 이미지 정적서버 구성후 반영*/}
            {/* Review Detail */}
            <div className="bg-gray-50 p-2 rounded-md">
              <h3 className="text-lg font-medium mb-4">
                {tr("detailedRatings")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {/* Taste 평가*/}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("taste")}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.reviewDetail.tasteRating}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewDetail: {
                          ...prev.reviewDetail,
                          tasteRating: Number(e.target.value),
                        },
                      }))
                    }
                  >
                    <option value={0}>-</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service 평가*/}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("service")}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.reviewDetail.serviceRating}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewDetail: {
                          ...prev.reviewDetail,
                          serviceRating: Number(e.target.value),
                        },
                      }))
                    }
                  >
                    <option value={0}>-</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>
                {/* Price 평가 */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("price")}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.reviewDetail.priceRating}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewDetail: {
                          ...prev.reviewDetail,
                          priceRating: Number(e.target.value),
                        },
                      }))
                    }
                  >
                    <option value={0}>-</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Visit Date, locale로 표현, defaut enUs*/}
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {tr("visitDate")}
                </label>
                <DatePicker
                  wrapperClassName="w-full"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  locale={localeMap[locale] || localeMap.en}
                  disabled={!isAdmin}
                  selected={
                    formData.reviewDetail.visitDate
                      ? new Date(formData.reviewDetail.visitDate)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      reviewDetail: {
                        ...prev.reviewDetail,
                        visitDate: date,
                      },
                    }))
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText={tr("datePlaceHolder")}
                />
              </div>
              {/* Visit Purpose */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {tr("visitPurpose")}
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.reviewDetail.visitPurpose}
                  disabled={!isAdmin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reviewDetail: {
                        ...prev.reviewDetail,
                        visitPurpose: e.target.value as VisitPurpose,
                      },
                    }))
                  }
                >
                  <option value="">-</option>
                  <option value="solo">{tr("purposes.solo")}</option>
                  <option value="couple">{tr("purposes.couple")}</option>
                  <option value="family">{tr("purposes.family")}</option>
                  <option value="friends">{tr("purposes.friends")}</option>
                  <option value="business">{tr("purposes.business")}</option>
                </select>
              </div>
            </div>
            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("transaction.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("transaction.editting") : t("transaction.change")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
