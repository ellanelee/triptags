"use client"

import { useTranslations } from "next-intl"

interface IVenueImageEmptyCardProps {
  onUpdate: () => void
}

//venue의 Image UI (이미지가 없는 경우, 등록가능)
export default function VenueImageEmptyCard({
  onUpdate,
}: IVenueImageEmptyCardProps) {
  const tr = useTranslations("VenueDetailPage")

  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl mb-2">📸</span>
      <p className="text-sm">{tr("noVenueImage")}</p>
      <button
        className="px-6 py-2.5 mt-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-sm 
                       hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-95 transition-all"
        type="button"
        onClick={onUpdate}
      >
        {tr("venueImageRegister")}
      </button>
    </div>
  )
}
