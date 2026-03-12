"use client"

import { useRouter } from "@/i18n/routing"
import { venueApi } from "@/lib/api/venue.api"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { IGetVenueAll } from "@/types/interfaces/interface.api"
import { ReviewForm } from "@/types/interfaces/interface.form"
import { I18nText, Language } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

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
  const { isAuthenticated, user } = useAuthStore()
  const [formData, setFormData] = useState<ReviewForm>({
    rating: 5,
    content: {} as I18nText,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.back()
    }
    venue.run(() => venueApi.getVenueById(venueId))
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userRole = user?.role

    try {
    } catch (error) {
      console.error("review제출에러", error)
    }

    router.push(`/venues/${venueId}`)
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
                value={formData.content[locale] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, [locale]: e.target.value },
                  })
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
