export interface MapPickerProps {
  center?: { lat: number; lng: number }
  zoom: number
  onLocationSelect: (location: { lat: number; lng: number }) => void
  markerPosition?: { lat: number; lng: number }
  className?: string
}
