import { useTranslations } from "next-intl"
import { useState } from "react"
import { FormField } from "@/components/common/form/FormField"
import { IFormErrors } from "@/lib/utils/domain/validateVenue"
import { IVenueAdminUpdateInput } from "@triptags/shared"

export interface IVenueRegionData extends Pick<
  IVenueAdminUpdateInput,
  "country" | "city" | "district" | "details"
> {}

export interface IVenueRegionFormProps<T extends IVenueRegionData> {
  venueData: T
  setVenueData: React.Dispatch<React.SetStateAction<T>>
  errors: IFormErrors
  submitted: boolean
  canEditRegion?: boolean
}

export function VenueRegionForm<T extends IVenueRegionData>({
  venueData,
  setVenueData,
  errors,
  submitted,
  canEditRegion = false,
}: IVenueRegionFormProps<T>) {
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")
  return (
    <div className="grid grid-cols-2 gap-3 bg-pink-50 rounded-md p-3">
      <FormField error={submitted ? errors.city : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("city")} *
        </label>
        <input
          type="text"
          required
          className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueData.city}
          disabled={!canEditRegion}
          onChange={(e) =>
            setVenueData((prev) => ({
              ...prev,
              city: e.target.value,
            }))
          }
        />
      </FormField>
      <FormField error={submitted ? errors.district : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("district")} *
        </label>
        <input
          type="text"
          required
          className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueData.district}
          disabled={!canEditRegion}
          onChange={(e) =>
            setVenueData((prev) => ({
              ...prev,
              district: e.target.value,
            }))
          }
        />
      </FormField>
      <FormField error={submitted ? errors.details : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr("details")} *
        </label>
        <input
          type="text"
          required
          className="w-full border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
          value={venueData.details}
          disabled={!canEditRegion}
          onChange={(e) =>
            setVenueData((prev) => ({
              ...prev,
              details: e.target.value,
            }))
          }
        />
      </FormField>
    </div>
  )
}
