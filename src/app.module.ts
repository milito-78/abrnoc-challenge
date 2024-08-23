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
  IRedisConfig,
  REDIS_CONFIG_TOKEN,
  registerConfig,
  registerDatabaseConfig,
  registerRedisConfig,
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
import { COUPONS_DATABASE_PROVIDER } from './coupons/database/providers/coupons.provider';
import { CouponsMysqlRepository } from './coupons/database/mysql/coupons.mysql';
import { CouponsEntity } from './coupons/database/mysql/schemas/coupons.schema';
import { CouponUsersEntity } from './coupons/database/mysql/schemas/coupon-user.schema';
import {
  createNewRedisLock,
  REDIS_LOCKER_TOKEN,
} from './infrastructure/redis/lock';

const container = createContainer();

export function containerResolve<T>(key: string): T {
  return container.resolve<T>(key);
}

export async function initConfig() {
  container
    .register(APP_CONFIG_TOKEN, asValue(registerConfig()))
    .register(DATABASE_CONFIG_TOKEN, asValue(registerDatabaseConfig()))
    .register(REDIS_CONFIG_TOKEN, asValue(registerRedisConfig()));
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
          c
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(TokenEntity),
        ),
    )
    .register(
      USERS_DATABASE_PROVIDER,
      asClass(UsersMysqlRepository)
        .singleton()
        .inject((c) =>
          c
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(UserEntity),
        ),
    )
    .register(
      USERS_DATABASE_PROVIDER,
      asClass(UsersMysqlRepository)
        .singleton()
        .inject((c) =>
          c
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(UserEntity),
        ),
    )
    .register(
      SERVERS_DATABASE_PROVIDER,
      asClass(ServersArrayRepository).singleton(),
    )
    .register(
      COUPONS_DATABASE_PROVIDER,
      asClass(CouponsMysqlRepository)
        .singleton()
        .setInjectionMode('CLASSIC')
        .inject((c) => ({
          couponRepository: c
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(CouponsEntity),
          couponUsersRepository: c
            .resolve<DataSource>(DATABASE_DATASOURCE_TOKEN)
            .getRepository(CouponUsersEntity),
        })),
    );
}

export async function register() {
  container.register(
    REDIS_LOCKER_TOKEN,
    asValue(
      createNewRedisLock(container.resolve<IRedisConfig>(REDIS_CONFIG_TOKEN)),
    ),
  );
}

export async function bootstrap() {
  await initConfig();
  await registerDb();
  await register();
}

export async function start(): Promise<boolean> {
  await bootstrap();
  return new Promise((resolve) => resolve(true));
}
