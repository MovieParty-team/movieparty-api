import { DataSource, DataSourceOptions } from 'typeorm';
import { envConfig } from './env.config';

const isTestMode = process.env.DB_TEST_MODE === 'true';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envConfig.dbHost,
  port: envConfig.dbPort,
  username: envConfig.dbUser,
  password: envConfig.dbPass,
  database: envConfig.dbName,
  schema: isTestMode ? 'test' : 'public',
  logging: !isTestMode,
  entities: ['dist/**/*.entity.{js,ts}'],
  subscribers: [],
  migrations: ['dist/migrations/*.{js,ts}'],
  // for functional tests
  dropSchema: isTestMode,
  synchronize: isTestMode,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

// Set up schema for test
export async function prepareTestSchema(dataSource: DataSource) {
  if (isTestMode) {
    await dataSource.query(`CREATE SCHEMA IF NOT EXISTS test`);
    await dataSource.query(`SET search_path TO test`);
  }
}
