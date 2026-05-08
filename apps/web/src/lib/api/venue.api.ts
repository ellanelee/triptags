import type {
  IVenueDetailResponse,
  IVenueCreateInput,
  IVenueDetailInput,
  IVenuePaginationInput,
  IVenueAdminUpdate,
  IVenueUpdateInput,
} from "@triptags/shared"
import apiClient from "./api.client"
import {
  IGetVenueAllResponse,
  IGetVenueBase,
} from "@/types/interfaces/interface.api"

export const venueApi = {
  getAllVenue: async (
    paginationDto: IVenuePaginationInput,
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

  createVenue: async (createDto: IVenueCreateInput) => {
    const response = await apiClient.post(`venues`, createDto)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },

  createVenueDetail: async (venueId: string, createDto: IVenueDetailInput) => {
    const response = await apiClient.post(`venueDetail/${venueId}`, createDto)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },

  //관리자의 venue수정
  updateVenue: async (venueId: string, createDto: IVenueUpdateInput) => {
    const response = await apiClient.post(`venues/${venueId}/admin`,createDto)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },
}
