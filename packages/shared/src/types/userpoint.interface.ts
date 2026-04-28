import { PointType, VerificationMethod } from "src/common/types";

export interface IUserPointAll {
  id: string;
  point: number;
  pointActivity: PointType;
  localVerified: VerificationMethod | null;
  createdAt: Date;
  venueId: string | null;
}
