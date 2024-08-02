import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { envConfig } from '@/config/env.config';
import { RequestSession } from '@/types/iamRequest.type';
import { IS_SKIP_AUTH } from '@/utils/skipAuth.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkipAuth = this.reflector.get<boolean>(
      IS_SKIP_AUTH,
      context.getHandler(),
    );
    if (isSkipAuth) {
      Logger.debug('Skipping auth check');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token && !request.session.accessToken) {
      Logger.debug('No token provided');
      request.session.destroy();
      throw new UnauthorizedException();
    } else if (!request.session.refreshToken || !request.session.accessToken) {
      Logger.debug('No refresh token or access token in session');
      throw new UnauthorizedException();
    } else if (
      await this.checkRefreshTokenExpired(request.session.refreshToken)
    ) {
      Logger.debug('Refresh token expired');
      request.session.destroy();
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        request.session.accessToken,
        {
          secret: envConfig.jwtSecret,
        },
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload.sub;
      await this.refreshTokenSet(payload.sub, request);
    } catch {
      Logger.error('error while verifying token set');
      throw new UnauthorizedException();
    }
    return true;
  }

  private async checkRefreshTokenExpired(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: envConfig.jwtSecret,
    });
    const now = Date.now();
    const exp = payload.exp * 1000;
    return now > exp;
  }

  private async refreshTokenSet(
    sub: string,
    request: RequestSession,
  ): Promise<void> {
    const payload = { sub: sub };
    Logger.log('payload:', payload);
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60s',
      secret: envConfig.jwtSecret,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '6d',
      secret: envConfig.jwtSecret,
    });
    request.session.accessToken = accessToken;
    request.session.refreshToken = refreshToken;
    request.session.save((err) => {
      if (err) {
        Logger.error('Error saving session:', err);
      }
    });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
