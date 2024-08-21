import {DataSource} from "typeorm";
import {IDatabaseConfig} from "../../app.config";

let connection : DataSource|null = null;

export function createDataSource(config: IDatabaseConfig): DataSource {
  if (connection === null){
    connection = new DataSource({
      type: 'mysql',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,

      synchronize: false, // Set to false in production
      /*logging: false,
      entities: ['dist/!**!/!*.entity.js'], // Replace with your entity paths
      migrations: ['dist/migrations/!*.js'], // Replace with your migrations paths*/
    });
  }

  return connection;
}


export const DATABASE_DATASOURCE_TOKEN = "database-datasource-token";