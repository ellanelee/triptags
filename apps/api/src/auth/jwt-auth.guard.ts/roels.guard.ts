import { ROLES_KEY } from '@/common/decorator/roles.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

type userValidated = { sub: string };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    //@Role이 없는 경우 검사 Pass
    if (!requiredRole || !requiredRole?.length) return true;

    //사용자 정보 가져오기
    const req = ctx.switchToHttp().getRequest<{ user?: userValidated }>();
    const userId = req.user?.sub;

    if (!userId) throw new UnauthorizedException('인증 정보가 없습ㄴ다');

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) throw new UnauthorizedException('사용자가 존재하지 않습니다');

    if (!requiredRole.includes(user.role))
      throw new UnauthorizedException('권한이 없습니다.');

    return true;
  }
}
