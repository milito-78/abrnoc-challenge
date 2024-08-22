import { DataSource } from 'typeorm';
import { IDatabaseConfig } from '../../app.config';
import { TokenEntity } from '../../auth/database/mysql/schemas/access-token.schema';
import { UserEntity } from '../../users/database/mysql/schemas/users.schema';

let connection: DataSource | null = null;

export async function createDataSource(
  config: IDatabaseConfig,
): Promise<DataSource> {
  if (connection === null) {
    connection = await new DataSource({
      type: 'mysql',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false, // Set to false in production
      logging: true,
      entities: [TokenEntity, UserEntity],
    }).initialize();

    console.log(connection.isInitialized);
  }

  return connection;
}

export const DATABASE_DATASOURCE_TOKEN = 'database-datasource-token';
