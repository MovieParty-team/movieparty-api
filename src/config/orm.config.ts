import { DataSource, DataSourceOptions } from 'typeorm';

import { envConfig } from './env.config';

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

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
