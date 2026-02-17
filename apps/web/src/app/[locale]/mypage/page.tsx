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
  const [destinations, setDestinations] = useState<DestinationWithRegion[]>([])
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


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="mt-2 text-gray-600">{user?.nickname}님, 환영합니다!</p>
        </div>

        {/* 관심 여행지 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">관심 여행지</h2>
            <button
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + 여행지 추가
            </button>
          </div>

          {/* 여행지 목록 */}
          {destinations.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-600">아직 관심 여행지가 없습니다.</p>
              <p className="text-sm text-gray-500">
                여행지를 추가하면 맞춤형 추천을 받을 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {destinations.map(destinations => (
                <div
                  key={destinations.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{destinations.displayName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {destinations.city} {destinations.district && `· ${destinations.district}`}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {destinations.sortPreference === 'rating' && '⭐ 평점 높은 순'}
                          {destinations.sortPreference === 'reviews' && '💬 리뷰 많은 순'}
                          {destinations.sortPreference === 'local' && '🏠 로컬 추천순'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
