import { useTranslations } from "next-intl"
import { useState } from "react"
import Image from "next/image"

interface IVenueImageEdit {
  imageUrls: string[]
  canEditImage: boolean
  onAdd: (url: string) => void
  onDelete: (url: string) => void
}

export function VenueImageEdit({
  imageUrls,
  canEditImage,
  onAdd,
  onDelete,
}: IVenueImageEdit) {
  const [imageUrlInput, setImageUrlInput] = useState<string>("")
  const tr = useTranslations("CreateVenuePage")
  const t = useTranslations("Common")

  console.log(imageUrls)
  //Edit imageUrl
  const handleAdd = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    onAdd(url)
    setImageUrlInput("")
  }

  return (
    <div className="bg-pink-50 rounded-md p-3">
      {/* title */}
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          {tr("venueImage")}
        </label>
        <span className="text-xs text-gray-500">{tr("registerImageUrl")}</span>
      </div>

      {/* add image url */}
      <div className="flex justify-between">
        <div className="flex flex-1 mr-5 gap-3">
          <input
            type="url"
            disabled={!canEditImage}
            className="flex-1 border bg-white border-gray-300 text-sm rounded-md px-3 py-2"
            placeholder="https://example.com/image.jpg"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm"
          onClick={handleAdd}
        >
          {t("transaction.create")}
        </button>
      </div>
      {/* display images */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-4/3 overflow-hidden rounded-md border bg-white"
            >
              <Image
                src={url}
                alt={"venue preview"}
                referrerPolicy="no-referrer"
                fill
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <button
                type="button"
                onClick={() => onDelete(url)}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
              >
                {t("transaction.delete")}
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">{tr("useMainImage")}</p>
    </div>
  )
}
