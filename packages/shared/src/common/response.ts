import { ApiResponse } from "./enums"

export const createResponse = <T>(
  success: true,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> => ({
  data,
  message,
  success,
  error,
})
