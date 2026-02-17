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
  const handleDeleteDestination = () => {}
  return (
    <button
      onClick={() => handleDeleteDestination(destinations.id)}
      className="text-red-600 hover:text-red-800"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  )
}
