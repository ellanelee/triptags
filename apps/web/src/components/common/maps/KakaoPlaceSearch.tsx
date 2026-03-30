"use client"

import { IKakaoPlace, IKakaoPlaceSearchProps } from "@/types/maps/kakao"
import axios from "axios"
import { useTranslations } from "next-intl"
import React, { useEffect, useState } from "react"

export function KakaoPlaceSearch({
  onPlaceSelected,
  placeholder = "search venue...",
}: IKakaoPlaceSearchProps) {
  const t = useTranslations("Common")
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<IKakaoPlace[]>([])
  const [exposeResults, setExposeResults] = useState(false)
  const [loading, setLoading] = useState(false)

  //debounce 처리
  useEffect(() => {
    if (!inputValue.trim()) return
    const timeoutId = setTimeout(() => {
      searchPlaces(inputValue)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [inputValue])

  //검색어 (상태설정)
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  //Places반환 (검색결과 상태설정)
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
    if (!apiKey) {
      console.error("Kakao Api Key is not configured")
    }
    setLoading(true)
    try {
      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        {
          params: {
            query,
            size: 10,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        },
      )
      const data = response.data
      console.log(data)
      setResults(data.documents) //
    } catch (e) {
      console.error("카카오 장소 검색 실패", e)
      setResults([])
    }
  }

  //place반환값중 venue선택 (place반환값중 venue선택)
  const handlePlaceClick = async (place: IKakaoPlace) => {
    setInputValue(place.place_name)
    setExposeResults(false)

    onPlaceSelected({
      id: place.id,
      name: place.place_name,
      category: place.category_group_name,
      address: place.address_name,
      roadAddress: place.road_address_name,
      phone: place.phone,
      longitude: parseFloat(place.x),
      latitude: parseFloat(place.y),
      placeUrl: place.place_url,
    })
  }

  return (
    <div>
      {/* 입력 */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => results.length > 0 && setExposeResults(true)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* 결과표시 */}
      {exposeResults &&
        results.length > 0 &&
        results.map((place) => (
          <ul>
            <li
              key={place.id}
              onClick={() => handlePlaceClick(place)}
              className=""
            >
              <p>{place.place_name}</p>
              <p>{place.road_address_name}</p>
              {place.category_group_name && <p>{place.category_group_name}</p>}
            </li>
          </ul>
        ))}
      {exposeResults && results.length === 0 && inputValue && !loading && (
        <div>
          <p>{t("noResults")}</p>
        </div>
      )}

      {/* 결과표시 */}
      {exposeResults && (
        <div className="" onClick={() => setExposeResults(false)} />
      )}
    </div>
  )
}
