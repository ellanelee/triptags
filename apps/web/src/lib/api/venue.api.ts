import type {
  IVenueDetailResponse,
  VenueCreateDto,
  VenueDetailDto,
  VenuePaginationDto,
} from "@triptags/shared"
import apiClient from "./api.client"
import {
  IGetVenueAllResponse,
  IGetVenueBase,
} from "@/types/interfaces/interface.api"

export const venueApi = {
  getAllVenue: async (
    paginationDto: VenuePaginationDto,
  ): Promise<IGetVenueAllResponse> => {
    const response = await apiClient.get(`venues/all`, {
      params: paginationDto,
    })
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data as IGetVenueAllResponse
  },

  //venueId로 venue전체 정보 받아오기
  getVenueById: async (venueId: string): Promise<IGetVenueBase> => {
    const response = await apiClient.get(`venues/${venueId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },

  getVenueDetail: async (venueId: string): Promise<IVenueDetailResponse> => {
    const response = await apiClient.get(`venueDetail/${venueId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data ?? null
  },

  createVenue: async (createDto: VenueCreateDto) => {
    const response = await apiClient.post(`venues`, createDto)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },

  createVenueDetail: async (venueId: string, createDto: VenueDetailDto) => {
    const response = await apiClient.post(`venues/{venueId}`, createDto)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },
}
