import { IGetVenueBase } from "@/types/interfaces/interface.api"
import { IVenueCreate, Language, VenueCategory } from "@triptags/shared"

type VenueRequiredFields = {
  name: string
  description: string
  venueCategory: VenueCategory | null
  country: string
  city: string
  district: string
  details: string
  latitude: number | null
  longitude: number | null
}

export interface IFormErrors {
  name?: string
  description?: string
  venueCategory?: string
  country?: string
  city?: string
  district?: string
  details?: string
  latitude?: string
  longitude?: string
}

export function validateVenueCreateForm(params: {
  venueData: VenueRequiredFields
}): IFormErrors {
  const { venueData } = params
  const errors: IFormErrors = {}

  if (!venueData.name.trim()) {
    errors.name = "장소 이름을 입력해주세요."
  }

  if (!venueData.description.trim()) {
    errors.description = "장소의 설명을 입력해주세요"
  }
  if (venueData.venueCategory === null) {
    errors.venueCategory = "카테고리를 선택해주세요."
  }

  if (!venueData.country.trim()) {
    errors.country = "국가 정보가 필요합니다."
  }

  if (!venueData.city.trim()) {
    errors.city = "도시 정보가 필요합니다."
  }

  if (!venueData.district.trim()) {
    errors.district = "지역 정보가 필요합니다."
  }

  if (!venueData.details.trim()) {
    errors.details = "상세 주소를 입력해주세요."
  }

  if (venueData.latitude == null) {
    errors.latitude = "위치를 지도에서 선택해주세요."
  }

  if (venueData.longitude == null) {
    errors.longitude = "위치를 지도에서 선택해주세요."
  }
  return errors
}
