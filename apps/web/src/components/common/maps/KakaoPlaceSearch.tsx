"use client"

import axios from "axios"
import { useState } from "react"

interface KakaoPlace {
  id: string
  place_name: string
  category_name: string
  phone: string
  address: string
  x: string //longitude
  y: string //latitude
  url: string
}

interface KakaoPlaceSearchProps {
  onPlaceSelected: (place: {
    id: string
    name: string
    address: string
    phone: string
    latitude: number
    longitude: number
    placeUrl: string
  }) => void
  placeholder?: string
}

export function KakaoPlaceSearch({
  onPlaceSelected,
  placeholder = "search venue...",
}: KakaoPlaceSearchProps) {
  const [results, setResults] = useState<KakaoPlace[]>([])
  const [loading, setLoading] = useState(false)

  const searchPlace = async (query: string) => {
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
      setResults(data.documents)
    } catch (e) {
      console.error("카카오 장소 검색 실패", e)
      setResults([])
    }
  }
}
