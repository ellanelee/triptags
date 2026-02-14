import { Prisma } from '@prisma/client';

export const USER_PERSONAL_SELECT = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  nickname: true,
  role: true,
  language: true,
  profileImage: true,
  provider: true,
  providerId: true,
  createdAt: true,
  profile: {
    select: {
      detailedAddress: true,
      latitude: true,
      longitude: true,
      introduction: true,
      reviewCount: true,
      helpfulCount: true,
    },
  },
});

export const USER_PUBLIC_SELECT = Prisma.validator<Prisma.UserSelect>()({
  nickname: true,
  profileImage: true,
  role: true,
  createdAt: true,
  profile: {
    select: {
      latitude: true,
      longitude: true,
      introduction: true,
      reviewCount: true,
      helpfulCount: true,
    },
  },
});

export const USER_UPDATE_SELECT = Prisma.validator<Prisma.UserSelect>()({
  profileImage: true,
  profile: {
    select: {
      detailedAddress: true,
      latitude: true,
      longitude: true,
      introduction: true,
    },
  },
});
