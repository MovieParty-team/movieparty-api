import { Request } from 'express';

export interface UserUuidRequest extends Request {
  uuid: string;
}

interface Session {
  userUuid: string;
  accessToken: string;
}

export interface RequestSession extends Request {
  session: Session & Request['session'];
}
