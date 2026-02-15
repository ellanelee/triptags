import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MyPage() {
  const tr = useTranslations("MyPage")
  const locale = useLocale()
  const router = useRouter()
  const [data, setData] = useState({
    email: "",
    nickname: "",
    language: "ko",
    profileImage: "",
    createdAt: "",
    introductions: "",
  })
  const [profiles, setProfile] = useState({
    id: "",
    regionId: "",
    detailedAddress: "",
    latitude: null,
    longitude: null,
    reviewCount: 0,
    helpfulCount: 0,
  })
  const [point, userPoint] = useState(0)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [addressDetails, setAddressDetails] = useState("")
  const [destination, setDestinations] = useState({})
  const [localVerification, setLocalVerification] = useState()
}
