"use client"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useEffect, useRef, useState } from "react"

interface PlaceAutoCompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
  placeHolder?: string
  className?: string
}

export function PlaceAutoComplete({
  onPlaceSelected,
  placeHolder = "here for searching a place...",
  className = "",
}: PlaceAutoCompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [exposePredictions, setExposePredictions] = useState(false)
  const places = useMapsLibrary("places") //전역 API Provider에서 places반환을 위한 Library, Hook

  //입력값이 있는 경우 자동완성 후보목록 반환 및 상태설정
  useEffect(() => {
    if (!places || !inputValue.trim()) {
      setPredictions([])
      return
    }
    //Place목록 반환(Input과 callback을 인자로 넘겨줌 (placeId, 이름등))
    const service = new places.AutocompleteService()
    service.getPlacePredictions({ input: inputValue }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPredictions(results)
        setExposePredictions(true)
      } else {
        setPredictions([])
      }
    })
  }, [places, inputValue])

  const handleSetPlace = (placeId: string) => {
    if (!places) return

    //조회된 place에 대한 상세정보 (name,geometry(lat/lng),addr,phone,url..)
    const service = new places.PlacesService(document.createElement("div")) //placeService는 DOM기반 (DOM context필요,지도 or 요소에 연결되어 동작)
    service.getDetails(
      {
        placeId,
        fields: [
          "geometry",
          "name",
          "fortmatted_address",
          "place_id",
          "types",
          "address_components",
        ],
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          onPlaceSelected(result)
          setInputValue(result.name || "")
          setExposePredictions(false)
        }
      },
    )
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange = {(e) => setInputValue(e.target.value)}
        onFocus = {()=> inputValue && setExposePredictions(true)}
        placeholder={placeHolder}
        className={`w-full border  border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${className}`}
      />
      {exposePredictions && predictions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handleSetPlace(prediction.place_id)}
              className="px-4 py-2  hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div>{prediction.structured_formatting.main_text}</div>
              <div>{prediction.structured_formatting.secondary_text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
