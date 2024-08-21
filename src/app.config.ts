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
}

export const APP_CONFIG_TOKEN = 'app-config-token';

export function registerConfig(): IConfig {
  return {
    name: process.env.APP_NAME ?? '',
  };
}
