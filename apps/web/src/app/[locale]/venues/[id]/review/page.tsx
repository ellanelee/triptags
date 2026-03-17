"use client"

import { localeMap } from "@/lib/utils/dateLocales"
import DatePicker from "react-datepicker"
import { useRouter } from "@/i18n/routing"
import { reviewApi } from "@/lib/api/review.api"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { IGetVenueAll } from "@/types/interfaces/interface.api"
import {
  Language,
  ReviewForm,
  VerificationMethod,
  VisitPurpose,
} from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { localApi } from "@/lib/api/local.api"
import { getCurrentPosition } from "@/lib/utils/geolocation"

export default function WriteReviewPage({
  params,
}: {
  params: {
    id: string
  }
}) {
  const tr = useTranslations("WriteReviewPage")
  const t = useTranslations("Common")
  const router = useRouter()
  const venueId = params.id
  const locale = useLocale() as Language
  const venue = useAsync<IGetVenueAll>(null)
  const localVerification = useAsync(null)
  const { isAuthenticated, user } = useAuthStore()
  const [formData, setFormData] = useState<ReviewForm>({
    rating: 5,
    contents: { [locale]: "" },
    authorRole: "USER",
    reviewDetail: {
      tasteRating: 5,
      serviceRating: 5,
      priceRating: 5,
      visitDate: null,
      visitPurpose: "",
    },
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.back()
    }
    venue.run(() => venueApi.getVenueById(venueId))
  }, [isAuthenticated])

  //granted(허용), denied(거부), prompt(선택 안함)
  const handleLocation = async () => {
    try {
      alert("현재 위치를 기반으로 인증합니다. 위치권한을 허용해주세요.")

      const location = await getCurrentPosition()
      const localInfo = {
        verificationMethod: "GPS" as VerificationMethod,
        latitude: location.latitude,
        longitude: location.longitude,
      }
      await localVerification.run(() =>
        localApi.getLocalVerification(venueId, localInfo),
      )
    } catch (e) {
      console.error(e)
      alert("위치 권한이 필요합니다")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venue.data?.id || !user?.role) {
      alert("정보가 로드되지 않았습니다.")
      return
    }
    const userRole = user?.role
    const submitData = {
      ...formData,
      authorRole: userRole,
      reviewDetail: {
        ...formData.reviewDetail,
        visitDate: formData.reviewDetail.visitDate ?? undefined,
      },
    }
    setLoading(true)
    try {
      console.log(submitData)
      const response = await reviewApi.createReview(venue.data?.id, submitData)
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
          <p className="text-lg text-gray-600 mb-8">
            {venue.data?.name ? venue.data.name[locale] : ""}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tr("rating")} *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
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
            {/* Review Detail */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {tr("detailedRatings")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Taste 평가*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr("taste")}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.reviewDetail.tasteRating}
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
              </div>
              {/* Service 평가*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr("service")}
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.reviewDetail.serviceRating}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr("price")}
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.reviewDetail.priceRating}
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
            {/* Visit Date, locale로 표현, defaut enUs*/}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tr("visitDate")}
            </label>
            <DatePicker
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              locale={localeMap[locale] || localeMap.en}
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
            {/* Visit Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tr("visitPurpose")}
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.reviewDetail.visitPurpose}
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
            {/* Location Verification */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    위치 인증
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    현재 위치를 인증하면 로컬 리뷰로 등록됩니다
                  </p>
                  <button onClick={handleLocation}></button>
                </div>
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
                {loading
                  ? t("transaction.submitting")
                  : t("transaction.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
