"use client"
import { IVenueDuplicatedResponse } from "@triptags/shared"
import { useLocale, useTranslations } from "next-intl"
import BasicButton from "../common/button/BasicButton"
import { useRouter } from "@/i18n/routing"

interface DuplicateVenueModalProps {
  open: boolean
  listDuplicated: IVenueDuplicatedResponse[]
  onClose: () => void
  onCreate: () => void
}

export function DuplicateVenueModal({
  open,
  listDuplicated,
  onClose,
  onCreate,
}: DuplicateVenueModalProps) {
  const locale = useLocale()
  const router = useRouter()
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")

  if (!open) return null

  const handleMoveToVenue = (venueId: string) => {
    router.replace(`/venues/${venueId}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {tr("venueDuplicatedNotice")}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          {tr("venueDuplicatedList")}
        </p>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {listDuplicated.map((el) => (
            <button
              key={el.id}
              type="button"
              onClick={() => handleMoveToVenue(el.id)}
              className="w-full rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-900">
                {typeof el.name[locale] === "string"
                  ? el.name[locale]
                  : Object.values(el.name ?? {})[0]}
              </span>
              <span className="text-sm text-gray-600 mt-1">
                {el.country} {el.city} {el.district} {el.detailedAddress}
              </span>
              <p className="text-xs text-gray-400 mt-1">{el.venueCategory}</p>
            </button>
          ))}
          <div className="flex items-center justify-center">
            <BasicButton className="m-2" onClick={onClose}>
              {tr("venueEdit")}
            </BasicButton>
            <BasicButton className="m-2" onClick={onCreate}>
              {tr("venueRegister")}
            </BasicButton>
          </div>
        </div>
      </div>
    </div>
  )
}
