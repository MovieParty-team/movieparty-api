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
    } else if (await this.checkTokenExpired(request.session.refreshToken)) {
      Logger.debug('Refresh token expired');
      request.session.destroy();
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.verifyToken(request.session.accessToken);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload.sub;
      Logger.debug('payload:', payload);
      await this.refreshTokenSet(payload.sub, request);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        try {
          const payload = await this.verifyToken(request.session.refreshToken);
          await this.refreshTokenSet(payload.sub, request);
          const newPayload = await this.verifyToken(
            request.session.accessToken,
          );
          request['user'] = newPayload.sub;
          return true;
        } catch (refreshError) {
          Logger.error('Error refreshing token:', refreshError.message);
          throw new UnauthorizedException('Unable to refresh token');
        }
      }
      Logger.error('Error verifying token:', error.message);
      throw new UnauthorizedException();
    }
    return true;
  }

  private async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.jwtSecret,
    });
  }

  private async checkTokenExpired(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken);
    const now = Date.now();
    const exp = payload.exp * 1000;
    return now > exp;
  }

  private async refreshTokenSet(sub: string, request: any): Promise<void> {
    const payload = { sub: sub };
    Logger.debug('entering function refresh');
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60s',
      secret: envConfig.jwtSecret,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '6d',
      secret: envConfig.jwtSecret,
    });
    Logger.debug('token signed');
    request.session.accessToken = accessToken;
    request.session.refreshToken = refreshToken;
    request.session.save();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
