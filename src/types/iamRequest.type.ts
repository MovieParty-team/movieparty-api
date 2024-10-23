import { Request } from 'express';

interface Session {
  accessToken: string;
  refreshToken: string;
}

export interface RequestSession extends Request {
  session: Session & Request['session'];
  user?: string; // user uuuid
}
