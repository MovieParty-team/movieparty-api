import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import 'dotenv/config';
import * as session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userUuid: string;
    token: string;
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: envConfig.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000, httpOnly: false, sameSite: 'lax' },
      name: 'movieparty.session',
    }),
  );

  await app.listen(process.env.API_PORT);
}
bootstrap();
