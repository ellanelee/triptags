import { PointType, VerificationMethod } from "@triptags/database";

export interface IUserPointAll {
  id: string;
  point: number;
  pointActivity: PointType;
  localVerified: VerificationMethod | null;
  createdAt: Date;
  venueId: string | null;
}
