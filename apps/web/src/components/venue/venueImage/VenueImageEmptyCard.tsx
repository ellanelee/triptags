"use client"

import { useTranslations } from "next-intl"

interface IVenueImageEmptyCardProps {
  onUpdate: () => void
  canEdit: boolean
}

//venue의 Image UI (이미지가 없는 경우, 등록가능)
export default function VenueImageEmptyCard({
  onUpdate,
  canEdit,
}: IVenueImageEmptyCardProps) {
  const tr = useTranslations("VenueDetailPage")

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-3xl mb-1">📸</span>
      <p className="text-sm">{tr("noVenueImage")}</p>
      <button
        className="px-6 py-1 mt-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-sm 
                       hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-95 transition-all"
        type="button"
        disabled={canEdit}
        onClick={onUpdate}
      >
        {tr("venueImageRegister")}
      </button>
    </div>
  )
}
