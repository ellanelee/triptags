"use client"
import { useRouter } from "@/i18n/routing"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { venueApi } from "@/lib/api/venue.api"
import { IGetVenueAll } from "@/types/interfaces/interface.api"

export default function VenueDetailPage(venueId: string) {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const tr = useTranslations("VenueDetailPage")
  const t = useTranslations("Common")
  const { isAuthenticated } = useAuthStore()
  const venue = useAsync<IGetVenueAll>(null)

  useEffect(() => {
    venue.run(() => venueApi.getVenueById(venueId))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upper Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {typeof venue.data?.name === "string"
              ? venue.data.name[locale]
              : ""}
          </h1>
          <p className="text-lg text-gray-600">
            {venue.data?.region?.parent?.name}
            {venue.data?.region && `, ${venue.data.region.name}`}
          </p>
        </div>
      </div>
    </div>
  )
}
