"use client"

import { userApi } from "@/lib/api/user.api"
import { useAsync } from "@/lib/hooks/use.async"
import { useAuthStore } from "@/store/auth-store"
import { IUserPointAll } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PointHistory() {
  const tr = useTranslations("MyPage")
  const t = useTranslations("Common")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const userPoint = useAsync<IUserPointAll[] | null>(null)
  const userPointSum =
    userPoint.data?.reduce(
      (acc: number, curr: IUserPointAll) => acc + curr.point,
      0,
    ) || 0

  useEffect(() => {
    if (!isAuthenticated) router.replace(`/${locale}/login`)
    if (!user?.id) return
    const response = userPoint.run(() => userApi.getUserPoint(user.id))
  }, [user?.id, userPoint.run])

  const activityMap: Record<string, string> = {
    REVIEW_WRITE: "리뷰 작성",
    VENUE_CREATE: " 장소 생성",
    HELPFUL_RECEIVED: "리뷰도움획득",
    LOCAL_VERIFIED: "로컬 인증",
  }

  const switchActivity = (pointActivity: string) => {
    return activityMap[pointActivity] ?? "내용이 없습니다"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← {t("transaction.back") ?? "뒤로가기"}
          </button>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {tr("totalPoint") ?? "전체 포인트 "} : {userPointSum}{" "}
          </h1>
        </div>
        <div className="my-3 pb-3 text-xl text-gray-900">
          {tr("pointHistory") ?? "포인트 이력조회"} :{" "}
        </div>
        <div className="flex items-center justify-center w-full">
          <div className="grid gap-4 w-fulll">
            {userPoint?.data?.map((el) => (
              <div
                key={el.id}
                className="flex justify-between border px-10 border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mx-4">
                    <div className="mx-4">포인트 내역: {el.point}, </div>
                    <span className="mx-1 pl-2">{tr("pointActivity")} :</span>
                    <span className="mx-2 pr-2">
                      {switchActivity(el.pointActivity)},
                    </span>
                    <div className="mx-4">
                      생성일 : {new Date(el.createdAt).toLocaleString("ko-Kr")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
