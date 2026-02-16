"use client"
import { useAuthStore } from "@/store/auth-store"
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
  const [destination, setDestinations] = useState({
    id: "",
    country: "",
    city: "",
    district: "",
    details: "",
  })
  const [point, userPoint] = useState(0)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [addressDetails, setAddressDetails] = useState("")

  const [localVerification, setLocalVerification] = useState()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}`)
    } else {
    }
  }, [isAuthenticated, router])

  const handleDAddress = () => {}
  
}
