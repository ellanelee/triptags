import { IVenueCreate, Language, VenueCategory } from "@triptags/shared"

export interface IFormErrors {
  language?: Language
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
  venueData: IVenueCreate
}): IFormErrors {
  const { venueData } = params
  const errors: IFormErrors = {}

  if (!venueData.name.trim()) {
    errors.name = "장소 이름을 입력해주세요."
  }
  if (!venueData.language.trim()) {
    errors.name = "언어가 설정되지 않았습니다"
  }
  if (!venueData.description.trim()) {
    errors.name = "장소의 설명을 입력해주세요"
  }
  if (!venueData.venueCategory.trim()) {
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
