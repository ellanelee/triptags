import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"

interface VenueSubmitProps {
  loading: boolean
}
export function VenueSubmit({ loading }: VenueSubmitProps) {
  const router = useRouter()
  const t = useTranslations("Common")
  return (
    <div className="flex gap-4 pt-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        {t("transaction.cancel")}
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? t("transaction.creating") : t("transaction.create")}
      </button>
    </div>
  )
}
