export interface IKakaoPlaceSearchProps {
  onPlaceSelected: (place: {
    id: string
    name: string
    category: string
    phone: string
    address: string
    roadAddress: string
    longitude: number
    latitude: number
    placeUrl: string
  }) => void
  placeholder?: string
}

export interface IKakaoPlace {
  id: string
  place_name: string
  category_group_name: string
  phone: string
  address_name: string
  road_address_name: string
  x: string //longitude
  y: string //latitude
  place_url: string
}

export interface IKakaoPlaceSelected {
  id: string
  name: string
  address: string
  roadAddress: string
  phone: string
  latitude: number
  longitude: number
  category: string
  placeUrl: string
}
