import { IFormErrors } from "@/lib/utils/domain/validateVenue"
import { IVenueAdminUpdateInput, IVenueDetailInput } from "@triptags/shared"
import { useTranslations } from "next-intl"

export interface IVenueDetailData extends Pick<
  IVenueAdminUpdateInput,
  "phoneNumber" | "priceRange" | "websiteUrl" | "workHour"
> {}

interface IVenueDetailProps<T extends IVenueDetailData> {
  venueDetail: T
  setVenueDetail: React.Dispatch<React.SetStateAction<T>>
  canEditVenueDetail?: boolean
}

export function VenueDetailForm<T extends IVenueDetailData>({
  venueDetail,
  setVenueDetail,
  canEditVenueDetail = false,
}: IVenueDetailProps<T>) {
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")

  return (
    <div className="grid grid-cols-2 gap-4  bg-pink-50 rounded-md p-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("phone")}
        </label>
        <input
          type="tel"
          className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueDetail.phoneNumber || ""}
          disabled={!canEditVenueDetail}
          onChange={(e) =>
            setVenueDetail((prev) => ({
              ...prev,
              phoneNumber: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("website")}
        </label>
        <input
          type="url"
          className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueDetail.websiteUrl}
          disabled={canEditVenueDetail}
          onChange={(e) =>
            setVenueDetail((prev) => ({
              ...prev,
              websiteUrl: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("priceRange")}
        </label>
        <input
          type="text"
          className="w-full border  bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueDetail.priceRange}
          disabled={canEditVenueDetail}
          onChange={(e) =>
            setVenueDetail((prev) => ({
              ...prev,
              priceRange: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("workHour")}
        </label>
        <input
          type="text"
          className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueDetail.workHour ?? ""}
          disabled={canEditVenueDetail}
          onChange={(e) =>
            setVenueDetail((prev) => ({
              ...prev,
              workHour: e.target.value,
            }))
          }
        />
      </div>
    </div>
  )
}
