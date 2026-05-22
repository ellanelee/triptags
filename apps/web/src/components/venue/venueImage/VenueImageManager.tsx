import { useTranslations } from "next-intl"
import VenueImageEmptyCard from "./VenueImageEmptyCard"
import VenueImageSlider from "./VenueImageSlider"
import { IVenueImage } from "@/types/interfaces/interface.api"
import { useRouter } from "@/i18n/routing"

interface IVenueImageManagerProps {
  venueImages?: IVenueImage[]
  venueId: string
  canEdit: boolean
}

export default function VenueImageManager({
  venueImages,
  venueId,
  canEdit,
}: IVenueImageManagerProps) {
  const tr = useTranslations("VenueDetailPage")
  const t = useTranslations("Common")
  const router = useRouter()

  console.log(canEdit)
  const handleUpdateVenues = () => {
    if (!canEdit) {
      alert(tr("unableToRegisterImage"))
      return
    }
    router.replace(`/venues/${venueId}/edit`)
  }

  console.log(venueImages)

  return (
    <>
      {venueImages?.length === 0 && (
        <VenueImageEmptyCard onUpdate={handleUpdateVenues} canEdit={canEdit} />
      )}
      {venueImages && venueImages?.length > 0 && (
        <VenueImageSlider venueImages={venueImages} />
      )}
    </>
  )
}
