"use client"
import { useCallback, useState } from "react"

type AsyncError = string | null

export function useAsync<T>(initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AsyncError>(null)

  const run = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    try{
        const result = await fn()
        setData(result)
        return result 
    }catch(e){
        const message = e instanceof Error ? e.message: "요청 중 오류가 발생했습니다"
        setError(message)
        throw e
    }finally {
        setLoading(false)
    }
  },[])

  const reset = useCallback(()=> {
    setData(initialData)
    setError(null)
    setLoading(false)
  },[initialData])

  return { data, setData, loading, error, run, reset}
}
