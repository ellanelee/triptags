import {
  IPointCreateInput,
  IPointInput,
  IUserPoint,
} from '@/common/type/types';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PointType, User, VerificationMethod } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';
import { IUserPointAll } from '@triptags/shared';

@Injectable()
export class UserPointService {
  constructor(private prisma: PrismaService) {}

  evaluatePoint(input: IPointInput): number {
    if (input.pointType) {
      switch (input.pointType) {
        case PointType.VENUE_CREATE:
          return 2000;
        case PointType.REVIEW_WRITE:
          return 500;
        case PointType.HELPFUL_RECEIVED:
          return 100;
        case PointType.LOCAL_VERIFIED:
          if (input.verificationMethod === VerificationMethod.ADDRESS) {
            return 1000;
          } else if (input.verificationMethod === VerificationMethod.GPS) {
            return 1000;
          } else if (input.verificationMethod === VerificationMethod.ACTIVITY) {
            return 1000;
          } else {
            throw new BadRequestException('데이터를 처리할수 없습니다');
          }
          break;
      }
    } else {
      throw new BadRequestException('데이터 처리에 오류가 있습니다');
    }
  }

  async getUserPoints(user: User): Promise<IUserPointAll[]> {
    return await this.prisma.client.userPoint.findMany({
      where: { user: user },
      select: {
        id: true,
        point: true,
        pointActivity: true,
        localVerified: true,
        createdAt: true,
        venueId: true,
      },
    });
  }

  async issuePoint(pointInput: IPointCreateInput) {
    const points = await this.prisma.client.userPoint.create({
      data: { ...pointInput },
    });
    console.log('포인트 발급완료: ', points);
    return points;
  }

  //이벤트 처리
  @OnEvent('venue.created')
  @OnEvent('review.created')
  @OnEvent('helpful.received')
  async handleGrantPoint(userPoint: IUserPoint) {
    console.log('이벤트 수신 성공:', userPoint.userId);
    const { userId, venueId, pointType, verificationMethod } = userPoint;
    const user = await this.prisma.client.user.findFirst({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('사용자를 찾을수 없습니다');

    const pointUp = this.evaluatePoint({ pointType, verificationMethod });
    console.log(pointUp);

    const baseData = {
      point: pointUp,
      userId: userId,
    };
    //LOCAL VERIFIED의 경우 ADDRESS, GPS, ACTIVITY로 LocalVerification으로 작동
    try {
      if (pointType === PointType.LOCAL_VERIFIED) {
        const data = {
          ...baseData,
          pointActivity: PointType.LOCAL_VERIFIED,
          localVerified: verificationMethod,
        };
        await this.issuePoint(data);
      } else if (pointType === PointType.HELPFUL_RECEIVED) {
        const data = {
          ...baseData,
          pointActivity: PointType.HELPFUL_RECEIVED,
        };
        await this.issuePoint(data);
      } else {
        const venue = await this.prisma.client.venue.findFirst({
          where: { id: userPoint.venueId },
        });
        if (!venue)
          throw new BadRequestException('관련 Venue를 찾을수 없습니다');
        const data = {
          ...baseData,
          pointActivity: pointType,
          venueId: venueId,
        };
        await this.issuePoint(data);
        console.log('포인트 발급완료');
      }
    } catch (error) {
      console.error('포인트 지급 실패:', error);
    }
  }

  @OnEvent('helpful.removed')
  async revokePoint(userPoint: IUserPoint) {
    console.log('삭제이벤트 수신성공:', userPoint.userId);
    const user = await this.prisma.client.user.findFirst({
      where: { id: userPoint.userId },
    });
    if (!user) throw new NotFoundException('사용자를 찾을수 없습니다');

    const pointDown = this.evaluatePoint({
      pointType: userPoint.pointType,
      verificationMethod: userPoint.verificationMethod,
    });
    await this.issuePoint({
      point: pointDown,
      pointActivity: userPoint.pointType,
      userId: userPoint.userId,
    });
    console.log('포인트 발급완료: ', pointDown);
  }
}
