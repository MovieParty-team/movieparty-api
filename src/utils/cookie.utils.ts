import { NodeEnv } from '@/api/enum/nodeEnv.enum';
import { envConfig } from '@/config/env.config';
import { Request, Response } from 'express';

interface CookieSet {
  name: string;
  value: string;
}

export const setCookie = (response: Response, set: CookieSet) => {
  response.cookie(set.name, set.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: envConfig.nodeEnv === NodeEnv.PRODUCTION,
  });
};

export const getCookie = (request: Request, name: string) => {
  return request.cookies[name];
};
