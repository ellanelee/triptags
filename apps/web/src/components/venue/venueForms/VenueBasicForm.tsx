import { IFormErrors } from "@/lib/utils/domain/validateVenue"
import {
  IVenueAdminUpdateInput,
  Language,
  venueCategories,
  VenueCategory,
} from "@triptags/shared"
import { FormField } from "@/components/common/form/FormField"
import { LanguageSelect } from "@/components/common/LanguageSelect"
import { useTranslations } from "next-intl"

export interface IBasicVenueData extends Pick<
  IVenueAdminUpdateInput,
  "language" | "name" | "description" | "venueCategory"
> {}

interface IBasicVenueProps<T extends IBasicVenueData> {
  venueData: T
  locale: string
  setVenueData: React.Dispatch<React.SetStateAction<T>>
  errors: IFormErrors
  submitted: boolean
  canEditName?: boolean
  canEditDescription?: boolean
  canEditCategory?: boolean
}

export function VenueBasicForm<T extends IBasicVenueData>({
  venueData,
  setVenueData,
  errors,
  submitted,
  canEditName = false,
  canEditDescription = false,
  canEditCategory = false,
  locale,
}: IBasicVenueProps<T>) {
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")

  return (
    <div className="flex flex-col bg-pink-50 rounded-md px-3 py-2">
      {/*언어표시*/}
      <div className="flex flex-col">
        <FormField error={submitted ? errors.name : ""}>
          <div className="flex items-center">
            <LanguageSelect
              label={tr("languageOption")}
              value={venueData.language}
              disabled={!canEditName}
              onChange={(val) =>
                setVenueData({
                  ...venueData,
                  language: val as Language,
                })
              }
              tr={t}
            />
          </div>
        </FormField>
        {/*이름표시*/}
        <FormField error={submitted ? errors.name : ""}>
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 my-2 flex-shrink:0 whitespace-nowrap">
              {tr("name")} ({t("transaction.language")}: {locale})
            </label>
            <input
              type="text"
              required
              disabled={!canEditName}
              className="w-full border text-sm bg-white border-gray-300 rounded-md m-2 px-2 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={venueData.name}
              onChange={(e) =>
                setVenueData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
        </FormField>
        {/*설명 표시*/}
        <FormField error={submitted ? errors.venueCategory : ""}>
          <label className="block text-sm font-medium text-gray-700 my-2">
            {tr("description")}
          </label>
          <textarea
            rows={4}
            className="w-full  bg-white border border-gray-300 text-sm rounded-md px-3 py-2"
            disabled={!canEditDescription}
            value={venueData.description || ""}
            onChange={(e) =>
              setVenueData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
      {/*카테고리 표시*/}
      <div className="flex flex-col bg-pink-50 rounded-md px-3 py-2">
        <FormField error={submitted ? errors.venueCategory : ""}>
          <div className="flex my-2 items-center">
            <label className="block text-sm font-medium text-gray-700 my-2 mr-2">
              {tr("category")} *
            </label>
            <select
              required
              className="text-sm font-medium text-gray-700"
              disabled={!canEditCategory}
              value={venueData.venueCategory ?? ""}
              onChange={(e) => {
                const value = e.target
                setVenueData((prev) => ({
                  ...prev,
                  venueCategory: (e.target.value as VenueCategory) || null,
                }))
              }}
            >
              <option value="">{tr("selectCategory")}</option>
              {venueCategories.map((el) => (
                <option key={el} value={el} className="text-sm">
                  {t(`categories.${el}`)}
                </option>
              ))}
            </select>
          </div>
        </FormField>
      </div>
    </div>
  )
}
