import dotenv from 'dotenv';
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
import { asFunction, asValue, AwilixContainer, createContainer } from 'awilix';

dotenv.config();
const container = createContainer();

container
  .register(APP_CONFIG_TOKEN, asValue(registerConfig()))
  .register(DATABASE_CONFIG_TOKEN, asValue(registerDatabaseConfig()))
  .register(
    DATABASE_DATASOURCE_TOKEN,
    asFunction(createDataSource)
      .singleton()
      .inject((container: AwilixContainer) =>
        container.resolve<IDatabaseConfig>(DATABASE_CONFIG_TOKEN),
      ),
  );
