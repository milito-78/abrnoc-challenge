const typeorm = require('typeorm');
require('dotenv').config();

module.exports = new typeorm.DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/mysql/schemas/**.schema{.ts,.js}'],
  migrations: ['dist/**/mysql/migrations/**.migrations{.ts,.js}'],
  synchronize: false,
  verboseRetryLog: true,
  autoLoadEntities: true,
  logging: true,
});
