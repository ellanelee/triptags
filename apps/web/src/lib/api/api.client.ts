import axios from "axios"
import { getLocale } from "next-intl/server"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const authStorage = localStorage.getItem("auth_storage")
      let locale = "ko" //locale default값 설정
      try {
        const fetchedLocale = await getLocale()
        if (fetchedLocale) {
          locale = fetchedLocale
        }
      } catch (error) {
        console.warn("Locale fetch failed, using default")
      }
      config.headers["Accept-Language"] = locale

      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        const token = parsed?.state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (error) {
      console.error("Failed to get auth token:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          console.error("인증이 필요합니다")
          if (typeof window != undefined) {
            localStorage.removeItem("auth_storage") //토큰 삭제
            window.location.href = "/login"
          }
          //이후에 refreshToken을 가져오는 로직 구현
          break

        case 403:
          console.error("권한이 없습니다. ")
          break

        case 500:
          console.error("서버에 문제가 있습니다. 다시 시도해주세요")
          break

        default:
          console.error(`에러가 발생하였습니다. ${response.status}`)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
