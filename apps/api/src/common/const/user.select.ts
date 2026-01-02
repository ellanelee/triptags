import { Prisma } from '@prisma/client';

export const USER_PUBLIC_SELECT = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  nickname: true,
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
