import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
} from 'awilix';
import {
  APP_CONFIG_TOKEN,
  DATABASE_CONFIG_TOKEN,
  IDatabaseConfig,
  registerConfig,
  registerDatabaseConfig,
} from './app.config';
import {
  createDataSource,
  DATABASE_DATASOURCE_TOKEN,
} from './infrastructure/mysql/connection';
import { ACCESS_TOKEN_DATABASE_PROVIDER } from './auth/database/providers/access-token.database.provider';
import { AccessTokenMysqlRepository } from './auth/database/mysql/access-token.mysql.database';
import { TokenEntity } from './auth/database/mysql/schemas/access-token.schema';
import { DataSource } from 'typeorm';
import { USERS_DATABASE_PROVIDER } from './users/database/providers/users.provider';
import { UsersMysqlRepository } from './users/database/mysql/users.mysql';
import { UserEntity } from './users/database/mysql/schemas/users.schema';
import { SERVERS_DATABASE_PROVIDER } from './servers/database/providers/servers.provider';
import { ServersArrayRepository } from './servers/database/array/servers.array';

const container = createContainer();

export function containerResolve<T>(key: string): T {
  return container.resolve<T>(key);
}

export async function initConfig() {
  container
    .register(APP_CONFIG_TOKEN, asValue(registerConfig()))
    .register(DATABASE_CONFIG_TOKEN, asValue(registerDatabaseConfig()));
}

export async function registerDb() {
  container
    .register(
      DATABASE_DATASOURCE_TOKEN,
      asValue(
        await createDataSource(
          container.resolve<IDatabaseConfig>(DATABASE_CONFIG_TOKEN),
        ),
      ),
    )
    .register(
      ACCESS_TOKEN_DATABASE_PROVIDER,
      asClass(AccessTokenMysqlRepository)
        .singleton()
        .inject((c) =>
          container
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(TokenEntity),
        ),
    )
    .register(
      USERS_DATABASE_PROVIDER,
      asClass(UsersMysqlRepository)
        .singleton()
        .inject((c) =>
          container
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(UserEntity),
        ),
    )
    .register(
      USERS_DATABASE_PROVIDER,
      asClass(UsersMysqlRepository)
        .singleton()
        .inject((c) =>
          container
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(UserEntity),
        ),
    )
    .register(
      SERVERS_DATABASE_PROVIDER,
      asClass(ServersArrayRepository).singleton(),
    );
}

export async function register() {}

export async function bootstrap() {
  await initConfig();
  await registerDb();
  await register();
}

export async function start(): Promise<boolean> {
  await bootstrap();
  return new Promise((resolve) => resolve(true));
}
