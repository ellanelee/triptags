import { useTranslations } from "next-intl"
import VenueImageEmptyCard from "./VenueImageEmptyCard"
import VenueImageSlider from "./VenueImageSlider"
import { IVenueImage } from "@/types/interfaces/interface.api"
import { useRouter } from "@/i18n/routing"

interface IVenueImageManagerProps {
  venueImages?: IVenueImage[]
  venueId: string
}

export default function VenueImageManager({
  venueImages,
  venueId,
}: IVenueImageManagerProps) {
  const tr = useTranslations("VenueDetailPage")
  const t = useTranslations("Common")
  const router = useRouter()

  const handleUpdateVenues = () => {
    router.replace(`/venues/${venueId}/edit`)
  }

  return (
    <>
      {venueImages?.length === 0 && <VenueImageEmptyCard onUpdate={handleUpdateVenues} />}
      {venueImages && venueImages?.length > 1 && (
        <VenueImageSlider venueImages={venueImages} />
      )}
    </>
  )
}
