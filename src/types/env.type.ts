import { NodeEnv } from '@/api/enum/nodeEnv.enum';

export default interface env {
  nodeEnv: NodeEnv;
  apiPort: number;
  apiHost: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPass: string;
  sessionSecret: string;
  brcyptSaltRounds: number;
  jwtSecret: string;
  frontendUrl: string;
  cookieSecret: string;
}
