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

  useEffect(() => {
    if (!isAuthenticated) router.replace(`/${locale}/login`)
    if (!user?.id) return
    const response = userPoint.run(() => userApi.getUserPoint(user.id))
  }, [user?.id, userPoint.run])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
            {tr("pointHistory") ?? "포인트 이력조회"}
          </h1>
        </div>
        <div className="flex items-center">
          <div className="grid gap-4">
            {userPoint?.data?.map((el) => (
              <div
                key={el.id}
                className="flex justify-between border px-10 border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>{el.point}</div>
                    <div>{el.pointActivity}</div>
                    {/* <div>{el.createdAt}</div> */}
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
