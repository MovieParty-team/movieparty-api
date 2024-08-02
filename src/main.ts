import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import 'dotenv/config';
import * as session from 'express-session';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: envConfig.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
        httpOnly: envConfig.nodeEnv === 'production', // false in dev for debug
        sameSite: 'lax',
      },
      name: 'movieparty.session',
    }),
  );

  await app.listen(process.env.API_PORT);
  app.enableCors();
  Logger.debug(`Application listening on port ${process.env.API_PORT}`);
}
bootstrap();
