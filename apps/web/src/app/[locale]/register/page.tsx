"use client"
import { authApi } from "@/lib/api/auth.api"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { RegisterDto } from "@triptags/shared"

export default function RegisterPage() {
  const tr = useTranslations("")
  const locale = useLocale()
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    language: "ko",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authApi.register(formData)
      if (response.success) {
        setSuccessMessage(response.message || "회원가입완료")
        setTimeout(() => {
          router.replace(`/${locale}`)
        }, 1000)
      }
    } catch (error) {
      const axiosError = error as any
      const errorMsg = (axiosError.response?.data?.message ||
        tr(axiosError)) as any
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }
}
