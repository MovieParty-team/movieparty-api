import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { envConfig } from '@/config/env.config';
import { IS_SKIP_AUTH } from '@/utils/skipAuth.utils';
import { RequestSession } from '@/types/iamRequest.type';
import { setCookie } from '@/utils/cookie.utils';

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
    const response = context.switchToHttp().getResponse();
    const { session } = request;
    const { cookies } = request;

    const refreshToken = request.session.refreshToken || cookies.refreshToken;

    try {
      if (!session) throw new UnauthorizedException('No session');

      if (!refreshToken) {
        response.clearCookie('refreshToken');
        request.session.destroy();
        throw new UnauthorizedException('No refresh token');
      } else if (await this.checkTokenExpired(refreshToken)) {
        response.clearCookie('refreshToken');
        request.session.destroy();
        throw new UnauthorizedException('Refresh token expired');
      }
      // access token doesn't exist
      else if (!request.session.accessToken) {
        const payload = await this.verifyToken(refreshToken);
        request['user'] = payload.sub;
        await this.refreshTokenSet(payload.sub, request, response);
        return true;
      }

      // access tokem exists
      const payload = await this.verifyToken(request.session.accessToken);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload.sub;
      await this.refreshTokenSet(payload.sub, request, response);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        try {
          const payload = await this.verifyToken(refreshToken);
          await this.refreshTokenSet(payload.sub, request, response);
          request['user'] = payload.sub;
          return true;
        } catch (refreshError) {
          Logger.error('Error refreshing token:', refreshError);
          request.session.destroy();
          response.clearCookie('refreshToken');
          throw new UnauthorizedException('Unable to refresh token');
        }
      }
      Logger.error('Error verifying token:', error);
      response.clearCookie('refreshToken');
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

  private async refreshTokenSet(
    sub: string,
    request: RequestSession,
    response: Response,
  ): Promise<void> {
    const payload = { sub: sub };
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

    response.clearCookie('refreshToken');

    setCookie(response, { name: 'refreshToken', value: refreshToken });

    request.session.save();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
