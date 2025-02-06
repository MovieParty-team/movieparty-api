import { NodeEnv } from '@/enum/nodeEnv.enum';
import { Logger } from '@nestjs/common';
import 'dotenv/config';
import env from 'src/types/env.type';

class EnvConfig implements env {
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
  providerApiUrl: string;

  constructor() {
    this.assignEnv();
    this.assertEnv();
    this.assertNodeEnv();
    Logger.debug('Environment set up');
  }

  private assignEnv() {
    this.nodeEnv = process.env.NODE_ENV as NodeEnv;
    this.apiPort = Number(process.env.API_PORT);
    this.apiHost = process.env.API_HOST;
    this.dbHost = process.env.POSTGRES_HOST;
    this.dbPort = Number(process.env.POSTGRES_PORT);
    this.dbName = process.env.POSTGRES_DB;
    this.dbUser = process.env.POSTGRES_USER;
    this.dbPass = process.env.POSTGRES_PASSWORD;
    this.sessionSecret = process.env.SESSION_SECRET;
    this.brcyptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    this.jwtSecret = process.env.JWT_SECRET;
    this.frontendUrl = process.env.FRONTEND_URL;
    this.cookieSecret = process.env.COOKIE_SECRET;
    this.providerApiUrl = process.env.PROVIDER_API_URL;
  }

  private assertNodeEnv() {
    if (!Object.values(NodeEnv).includes(this.nodeEnv)) {
      throw new Error(`Invalid NODE_ENV: ${this.nodeEnv}`);
    }
  }

  /**
   * This will throw an error if any env variable is missing at startup
   */
  private assertEnv() {
    for (const key in this) {
      if (!this.hasOwnProperty(key)) {
        continue;
      }

      const value = this[key];

      if (typeof value === 'undefined' || value === null) {
        throw new Error(`Missing env variable: ${key}`);
      }

      if (typeof value === 'string' && value.trim() === '') {
        throw new Error(`Missing env variable: ${key}`);
      }

      if (typeof value === 'number' && isNaN(value)) {
        throw new Error(`Missing env variable: ${key}`);
      } else if (typeof value === 'number' && value === 0) {
        Logger.warn(
          `Zero value env for variable: ${key}. Check if your config is correct.`,
        );
      }
    }
  }
}

export const envConfig = new EnvConfig();
