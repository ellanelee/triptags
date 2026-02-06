import { PointType, VerificationMethod } from '@prisma/client';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: JwtSubInfo;
}

export interface JwtSubInfo {
  sub: string;
}

export interface IPointInput {
  pointType?: PointType;
  verificationMethod?: VerificationMethod;
}

export interface IUserPoint {
  userId: string;
  venueId?: string;
  pointType: PointType;
  verificationMethod?: VerificationMethod;
}

export interface IPointCreateInput {
  point: number;
  pointActivity: PointType;
  localVerified?: VerificationMethod;
  userId: string;
  venueId?: string;
  localVerificationId?: string;
}

export interface IVenueSearch {
  code: string;
  parentId?: string;
}
