export interface IDatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string | undefined;
  database: string;
}

export const DATABASE_CONFIG_TOKEN = 'database-config-token';

export function registerDatabaseConfig(): IDatabaseConfig {
  let port = 3306;
  if (process.env.DB_PORT !== undefined) {
    port = Number(process.env.DB_PORT);
  }

  return {
    database: process.env.DB_NAME ?? 'abrnoc',
    host: process.env.DB_HOST ?? 'localhost',
    password: process.env.DB_PASSWORD,
    port: port,
    type: 'mysql',
    username: process.env.DB_USERNAME ?? 'root',
  };
}

export interface IConfig {
  name: string;
  httpPort: number;
  loggLevel: string;
}

export const APP_CONFIG_TOKEN = 'app-config-token';

export function registerConfig(): IConfig {
  return {
    name: process.env.APP_NAME ?? '',
    loggLevel: process.env.LOG_LEVEL ?? 'info',
    httpPort: Number(process.env.HTTP_PORT ?? '3000'),
  };
}

export interface IRedisConfig {
  host: string;
  port: number;
  auth?: string;
  db: number;
}

export function registerRedisConfig(): IRedisConfig {
  let db = 0;
  if (process.env.REDIS_DB !== undefined) {
    db = Number(process.env.REDIS_DB);
  }

  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? '6379'),
    auth: process.env.REDIS_PASSWORD,
    db: db,
  };
}

export const REDIS_CONFIG_TOKEN = 'redis-config-token';
