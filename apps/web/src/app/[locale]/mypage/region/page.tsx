"use client"

import { useAuthStore } from "@/store/auth-store"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MyRegion() {
  const tr = useTranslations("MyPage")
  const locale = useLocale()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [data, setData] = useState({
    country: "",
    city: "",
    district: "",
    details: "",
  })
  const handleSubmitRegion = async(e: React.FormEvent) => {
     e.preventDefault()
     
     try{

     }catch(error){


     }finally{
  } 

  }
}