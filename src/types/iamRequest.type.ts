import { Request } from 'express';

export interface UserUuidRequest extends Request {
  uuid: string;
}

interface Session {
  accessToken: string;
  refreshToken: string;
}

export interface RequestSession extends Request {
  session: Session & Request['session'];
  user?: string; // user uuuid
}
