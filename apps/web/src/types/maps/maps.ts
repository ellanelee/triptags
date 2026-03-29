export interface MapPickerProps {
  center: { lat: number; lng: number } | null
  zoom: number
  onLocationSelect: (location: { lat: number; lng: number }) => void
  markerPosition : { lat: number; lng: number } | null
  className: string | null
}
