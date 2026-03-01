"use client"
import { UserIntroductionDto } from "@triptags/shared"
import BasicButton from "../common/Button/BasicButton"
import { userApi } from "@/lib/api/user.api"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

export default function Introduction({ savedText }: { savedText: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(savedText)
  const t = useTranslations("Common")
  const tr = useTranslations("Introduction")

  useEffect(() => {
    setText(savedText)
  }, [savedText])

  const handleIntroduction = async (introduction: UserIntroductionDto) => {
    try {
      console.log("구동")
      const response = await userApi.updateIntroduction(introduction)
      console.log(response)
      setIsEditing(false)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">소개글</h2>
        <BasicButton
          onClick={
            isEditing
              ? () => handleIntroduction({ introduction: text })
              : () => setIsEditing(true)
          }
          type="button"
        >
          {isEditing ? t("edit") : "수정"}
        </BasicButton>
      </div>
      <div className="grid gap-4">
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          {isEditing ? (
            <textarea
              className="w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none border border-gray-300 text-xl font-medium text-gray-900 shadow-xl"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <p>{text || tr("noIntoruction")}</p>
          )}
        </div>
      </div>
    </div>
  )
}
