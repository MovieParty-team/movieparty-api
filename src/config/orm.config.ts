import { DataSource, DataSourceOptions } from 'typeorm';

import { envConfig } from './env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envConfig.dbHost,
  port: envConfig.dbPort,
  username: envConfig.dbUser,
  password: envConfig.dbPass,
  database: envConfig.dbName,
  schema: 'public',
  logging: true,
  entities: ['dist/**/*.entity.{js,ts}'],
  subscribers: [],
  migrations: ['dist/migrations/*.{js,ts}'],
};

export const typeOrmTestingConfig = (): DynamicModule =>
  TypeOrmModule.forRoot({
    ...dataSourceOptions,
    schema: 'test',
    entities: ['dist/**/*.entity.{js,ts}'],
    keepConnectionAlive: true,
    dropSchema: true,
    synchronize: true,
  });

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
