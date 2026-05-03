import type { VerificationMethod } from "../common/types"

export interface ILocalVerificationCreateInput {
  verificationMethod: VerificationMethod
  longitude?: number
  latitude?: number
}
