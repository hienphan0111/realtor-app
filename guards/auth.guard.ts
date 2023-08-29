import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles.length !== 0) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split(' ')[1];
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload['id'],
          },
        });
        return roles.includes(user.userType);
      } catch (err) {
        throw new UnauthorizedException();
      }
    }
    return true;
  }
}
