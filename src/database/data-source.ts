import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NodeEnv } from '../utils/types/gobal.type';
import { booleanValidator, numberValidator } from '../utils/helpers/env.helper';

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: numberValidator(process.env.DATABASE_PORT, 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: booleanValidator(process.env.DATABASE_SYNCHRONIZE, false),
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== NodeEnv.PRODUCTION,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',

    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: numberValidator(process.env.DATABASE_MAX_CONNECTIONS, 100),
    ssl: booleanValidator(process.env.DATABASE_SSL_ENABLED, false)
      ? {
          rejectUnauthorized: booleanValidator(
            process.env.DATABASE_REJECT_UNAUTHORIZED,
            false,
          ),
          ca: process.env.DATABASE_CA ?? undefined,
          key: process.env.DATABASE_KEY ?? undefined,
          cert: process.env.DATABASE_CERT ?? undefined,
        }
      : undefined,
  },
} as DataSourceOptions);
