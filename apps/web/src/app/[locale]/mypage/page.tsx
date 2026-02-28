"use client"
import BasicButton from "@/components/common/Button/BasicButton"
import DeleteButton from "@/components/common/Button/DeleteButton"
import { LanguageSelect } from "@/components/common/LanguageSelect"
import Introduction from "@/components/mypage/introduction"
import MyReview from "@/components/mypage/myreview"
import { destinationApi } from "@/lib/api/destination.api"
import { regionApi } from "@/lib/api/region.api"
import { userApi } from "@/lib/api/user.api"
import { useAsync } from "@/lib/hooks/use.async"
import { destinationName } from "@/lib/utils/format.region"
import { useAuthStore } from "@/store/auth-store"
import { DestinationWithRegion, RegionInfo } from "@/types/types"
import { IUserPointAll, IUserResponse } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MyPage() {
  const tr = useTranslations("MyPage")
  const t = useTranslations("Common")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  const destinations = useAsync<DestinationWithRegion[]>([])
  const userProfiles = useAsync<IUserResponse | null>(null)
  const addressRegion = useAsync<RegionInfo | null>(null)
  const userPoint = useAsync<IUserPointAll[] | null>(null)
  const userPointSum =
    userPoint.data?.reduce(
      (acc: number, curr: IUserPointAll) => acc + curr.point,
      0,
    ) || 0

  //인증확인 후 destination정보 불러오기
  useEffect(() => {
    if (!isAuthenticated) router.replace(`/${locale}/login`)
    destinations.run(() => destinationApi.getInfo())
  }, [destinations.run])

  //set Profile (User확인 후 profile불러오기)
  useEffect(() => {
    if (!user?.id) return //미실행시 종료
    const response = userPoint.run(() => userApi.getUserPoint(user.id))
  }, [user?.id, userPoint.run])

  //UserPoint
  useEffect(() => {
    if (!user?.id) return //미실행시 종료
    userProfiles.run(() => userApi.getMyProfile(user.id))
  }, [user?.id, userProfiles.run])

  //set address (from district Id of userProfileDB)
  useEffect(() => {
    console.log(userProfiles)
    const regionId = userProfiles.data?.profile?.regionId
    console.log(regionId)
    if (regionId) {
      addressRegion.run(() => regionApi.getRegionHierarchical(regionId))
    }
  }, [userProfiles.data?.profile?.regionId])

  //언어 변경
  const handleLanguage = async (newLang: string) => {
    try {
      const response = await userApi.updateLanguage({ language: newLang })
      if (response.success) {
        useAuthStore.getState()
      }
      router.push(`/${response.data.language}/mypage`)
    } catch (e) {
      console.error("언어 업데이트 실패: ", e)
      alert("언어변경중 오류발생")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await destinationApi.remove(id)
      destinations.run(() => destinationApi.getInfo())
    } catch (error) {
      console.error("삭제 실패: ", error)
    }
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
            {/* 개인별 설정 */}
            <div className="flex flex-col w-full mx-4">
              <div className="flex items-center mx-6 my-2">
                <p className="text-gray-600 pr-10">
                  {tr("welcome", { nickname: user?.nickname || "guest" })}
                </p>
                <p className="text-gray-600 pr-10">
                  {tr("role")} : {user?.role}
                </p>
                <div className="flex items-center">
                  <p className="text-gray-600 pr-10 whitespace-nowrap">
                    {tr("language")}: {user?.language}
                  </p>
                  <LanguageSelect
                    label={tr("languageOption")}
                    value={user?.language ?? "ko"}
                    onChange={(value) => handleLanguage(value)}
                    tr={t}
                  />
                </div>
              </div>
              <div className="flex items-center px-1 pb-1">
                <p className="text-gray-600 px-5">주소 : </p>
                {addressRegion && (
                  <p className="bg-gray-100 text-gray-800">
                    {destinationName(addressRegion.data)}{" "}
                    {userProfiles.data?.profile?.detailedAddress}
                  </p>
                )}
                <button
                  onClick={() => router.push(`/${locale}/mypage/setaddress`)}
                  className="px-2 py-2 mx-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  + 주소 등록 / 변경
                </button>
              </div>
              <p className="mt-2 px-6 text-gray-600">
                회원 가입일 :{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
        </div>
        {/* 자기소개 Update, 이후 주소 변경가능 */}
        <Introduction
          savedText={userProfiles.data?.profile?.introduction || ""}
        />
        {/* 관심 여행지 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">관심 여행지</h2>
            <BasicButton
              onClick={() => {
                router.push(`/${locale}/mypage/setdestinations`)
              }}
              type="button"
            >
              관심여행지 수정
            </BasicButton>
          </div>

          {/* 여행지 목록 */}
          {destinations?.data?.length === 0 ? (
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
              {destinations?.data?.map((destination) => (
                <div
                  key={destination.id}
                  className="flex justify-between border px-10 border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>{destinationName(destination.region)}</div>
                    </div>
                  </div>
                  <DeleteButton onClick={() => handleDelete(destination.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* UserPoint */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              사용자 포인트 : {userPointSum}
              <span className="text-xl text-gray-900"> points</span>{" "}
            </h2>
            <button
              onClick={() => router.push(`/${locale}/mypage/pointHistory`)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + {tr("pointHistory")}
            </button>
          </div>
        </div>
        {/* My Review보여주기 최근 3개까지?? */}
        <MyReview />
      </div>
    </div>
  )
}
