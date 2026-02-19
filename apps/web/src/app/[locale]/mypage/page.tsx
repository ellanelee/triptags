"use client"
import { LanguageSelect } from "@/components/common/LanguageSelect"
import apiClient from "@/lib/api/api.client"
import { destinationApi } from "@/lib/api/destination.api"
import { destinationInfo } from "@/lib/utils/format.region"
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
    const fetchDestination = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await destinationApi.getInfo()
        if (response.success && response.data) {
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

  const handleLanguage = () => {
    
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My</h1>
          <div className="flex items-center">
            {/*Profile Image */}
            <div className="relative group">
              <div className="w-30 h-30 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                {user?.profileImage ? (
                  // 이미지가 있을 때
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // 이미지가 없을 때 (업로드 아이콘 대용)
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      이미지 등록/변경
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full mx-4">
              <div className="flex justify-between pb-1 px-6">
                <div className="flex">
                  <p className="text-gray-600 pr-10">
                    {tr("welcome", { nickname: user?.nickname || "guest" })}
                  </p>
                  <p className="text-gray-600 pr-10">
                    {tr("language")}: {user?.language}
                  </p>
                </div>
                <LanguageSelect label={tr("language")} value={value}
                onChange={(val)=> }

                 />
              </div>
              <div className="flex items-center px-6 pb-1">
                <p className="text-gray-600 pr-10">주소</p>
                <button className="px-2 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-primary-700 transition-colors">
                  + 주소 등록 / 변경
                </button>
              </div>
              <p className="mt-2 px-6 text-gray-600">
                회원 가입일:{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {/* 관심 여행지 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">관심 여행지</h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              + 관심 여행지 수정
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
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>{destinationInfo(destination.region)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* UserPoint */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">사용자 포인트</h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              + 포인트 이력조회
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
