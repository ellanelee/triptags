import { useTranslations } from "next-intl"
import { useState } from "react"

interface IVenueImageEdit {
  imageUrls: string[]
  onAdd: (url: string) => void
  onDelete: (url: string) => void
}

export function VenueImageEdit({
  imageUrls,
  onAdd,
  onDelete,
}: IVenueImageEdit) {
  const [imageUrlInput, setImageUrlInput] = useState<string>("")
  const tr = useTranslations("VenueDetailPage")

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
      <div className="flex gap-2">
        <input
          type="url"
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
        {tr("transaction.create")}
      </button>

      {/* display images */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {imageUrls.map((el) => (
            <div key={el} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <img
                src={el}
                alt={"venue preview"}
                className="w-full aspect-4/3 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <button
                type="button"
                onClick={() => onDelete(el)}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
              >
                {tr("delete")}
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">{tr("useMainImage")}</p>
    </div>
  )
}
