import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import 'dotenv/config';
import * as session from 'express-session';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NodeEnv } from './api/enum/nodeEnv.enum';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: envConfig.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: envConfig.nodeEnv === NodeEnv.PRODUCTION,
        path: '/',
      },
      name: 'movieparty.session',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Movieparty API')
    .setDescription('The movieparty API for Movieparty website')
    .setVersion('1.0')
    .addTag('movieparty')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  let corsOptions: CorsOptions;
  if (envConfig.nodeEnv !== NodeEnv.DEV) {
    corsOptions = {
      origin: envConfig.frontendUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    };
  } else {
    // in dev mode you can edit the options
    corsOptions = {
      origin: envConfig.frontendUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    };
  }

  app.enableCors(corsOptions);
  app.use(cookieParser());

  await app.listen(process.env.API_PORT);
  Logger.debug(`Application listening on port ${process.env.API_PORT}`);
}
bootstrap();
