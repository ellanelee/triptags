"use client"
import { APIProvider } from "@vis.gl/react-google-maps"
import { ReactNode } from "react"

interface GoogleMapsProviderProps {
  children: ReactNode
}

//구글 Map 전역 Provider구성
export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return <div>구글 Map을 위한 Api Key를 찾을수 없습니다.</div>
  }

  return (
    //API Provider로 places와 marker를 내려줌 (Google Maps JS SDK로딩)
    <APIProvider apiKey={apiKey} libraries={["places", "marker"]}>
      {children}
    </APIProvider>
  )
}
