"use client"

import { MapPickerProps } from "@/types/maps/maps"
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps"
import { useCallback, useState } from "react"

const defaultCenter = { lat: 37.5665, lng: 126.978 } //Seoul, KR(중심위치)

//지도와 마커표시 ( Map Click시 Marker의 Latlng의 좌표가 
export default function MapPicker({
  center = defaultCenter,
  zoom = 13,
  onLocationSelect,
  markerPosition: externalMarkerPosition,
  className = "",
}: MapPickerProps) {
  const [internalMarkerPosition, setInternalMarkerPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const markerPosition = externalMarkerPosition ?? internalMarkerPosition
  const onMapClick = useCallback(
    (e: any) => {
      const latLng = e.detail?.latLng
      if (latLng) {
        const position = { lat: latLng.lat, lng: latLng.lng }
        setInternalMarkerPosition(position)
        onLocationSelect(position)
      }
    },
    [onLocationSelect],
  )

  return (
    <div>
      <div
        className={`w-full h-[400px] rounded-lg overflow-hidden ${className}`}
      >
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          center={markerPosition || null}
          zoom={zoom}
          onClick={onMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
          clickableIcons={false}
          mapId="venue_map_id"
        />
        {markerPosition && <AdvancedMarker position={markerPosition} />}
      </div>
    </div>
  )
}
