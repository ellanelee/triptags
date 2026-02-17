"use client"
import apiClient from "@/lib/api/api.client"
import { destinationApi } from "@/lib/api/destination.api"
import { useAuthStore } from "@/store/auth-store"
import { DestinationWithRegion } from "@/types/types"
import { ApiResponse } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MyPage() {
  const tr = useTranslations("MyPage")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [data, setData] = useState({
    email: "",
    nickname: "",
    language: "ko",
    profileImage: "",
    createdAt: "",
    introductions: "",
  })
  const [profiles, setProfile] = useState({
    id: "",
    regionId: "",
    detailedAddress: "",
    latitude: null,
    longitude: null,
    reviewCount: 0,
    helpfulCount: 0,
  })
  const [destination, setDestinations] = useState<DestinationWithRegion[]>([])
  const [point, userPoint] = useState(0)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [addressDetails, setAddressDetails] = useState("")

  const [localVerification, setLocalVerification] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}`)
    } else {
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await destinationApi.get()
        if (response.suceess && response.data) {
          setDestinations(response.data)
        } else {
          setError(response.data.message ?? response.data.error ?? "조회 실패")
        }
      } catch (error) {
        setError("destination 조회 실패")
      } finally {
        setLoading(false)
      }
    }
    fetchDestination()
  }, [])

  const handleDAddress = () => {}
}
