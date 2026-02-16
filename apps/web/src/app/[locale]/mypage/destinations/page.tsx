"use client"

import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MyDestination() {
  const tr = useTranslations("MyPage")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const handleSubmitDestination = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
    } catch (error) {
    } finally {
    }
  }
}
