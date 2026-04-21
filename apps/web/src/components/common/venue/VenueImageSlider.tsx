"use client"
import { IVenueImage } from "@/types/interfaces/interface.api"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "../icons/cheronIton"

interface IVenueImageSliderProps {
  venueImages: IVenueImage[]
}

export default function VenueImageSlider({
  venueImages,
}: IVenueImageSliderProps) {
  const tr = useTranslations("VenueDetailPage")
  const [currentIdx, setCurrentIdx] = useState(0)

  if (!venueImages || venueImages.length === 0) {
    return (
      <div className="aspect-[4/3] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">📸</span>
          <p className="text-sm">{tr("noVenueImage")}</p>
          <button
            className="px-6 py-2.5 mt-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-sm 
                       hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-95 transition-all"
            type="button"
          >
            {tr("venueImageRegister")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 group shadow-md">
        <Image
          src={venueImages[currentIdx].imageUrl}
          className="object-cover transition-all duration-500 ease-in-out"
          alt="venue"
          fill
          priority
        />
        {venueImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() =>
                setCurrentIdx((prev) =>
                  prev === venueImages.length - 1 ? 0 : prev + 1,
                )
              }
            >
              <ChevronRightIcon />
            </button>
            <button
              onClick={() =>
                setCurrentIdx((prev) =>
                  prev === 0 ? venueImages.length - 1 : prev - 1,
                )
              }
            >
              <ChevronLeftIcon />
            </button>
          </div>
        )}
        {venueImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pt-1">
            {venueImages.map((el, idx) => (
              <button
                key={el.id}
                onClick={() => setCurrentIdx(idx)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === currentIdx
                    ? "border-primary-600 ring-2 ring-primary-100 scale-105"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={el.imageUrl}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
