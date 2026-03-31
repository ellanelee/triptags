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
    const trimmedValue = inputValue.trim()
    //입력값이 없는 경우 초기화
    if (!trimmedValue) {
      setResults([])
      setExposeResults(false)
      setLoading(false)
      return
    }
    const timeoutId = setTimeout(() => {
      searchPlaces(trimmedValue)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [inputValue])

  //검색어 (상태설정)
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value
    setInputValue(targetValue)
  }

  //Places반환 (검색결과 상태설정)
  const searchPlaces = async (query: string) => {
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
      console.log(response)
      const documents = response.data.documents ?? []
      setResults(documents)
      setExposeResults(documents.length > 0)
    } catch (e) {
      console.error("카카오 장소 검색 실패", e)
      setResults([])
      setExposeResults(false)
    } finally {
      setLoading(false)
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
    <div className="relative">
      {/* 입력 */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (results.length > 0) setExposeResults(true)
        }}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* 결과표시 */}
      {exposeResults && inputValue.trim() && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.length > 0
            ? results.map((place) => (
                <li
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className=""
                >
                  <span>{place.place_name}, </span>
                  <span>{place.road_address_name} </span>
                  {place.category_group_name && (
                    <span>({place.category_group_name}) </span>
                  )}
                </li>
              ))
            : !loading && (
                <li className="px-3 py-2 text-sm text-gray-500">
                  {t("noResults")}
                </li>
              )}
        </ul>
      )}
      {exposeResults && results.length === 0 && inputValue && !loading && (
        <div>
          <p>{t("noResults")}</p>
        </div>
      )}

      {/* 외부 클릭시 입력내용 제거 */}
      {exposeResults && (
        <div
          onClick={() => setExposeResults(false)}
          className="fixed inset-0 z-0"
        />
      )}
    </div>
  )
}
