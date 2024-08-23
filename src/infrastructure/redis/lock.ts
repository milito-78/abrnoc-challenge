import Client from 'ioredis';
import Redlock from 'redlock';
import { IRedisConfig } from '../../app.config';

let connection: Client | null = null;
let locker: Redlock | null = null;

export function createRedisClient(config: IRedisConfig): Client {
  if (connection) return connection;

  connection = new Client({
    host: config.host,
    password: config.auth,
    db: config.db,
  });

  return connection;
}

export function createNewRedisLock(config: IRedisConfig) {
  if (locker) return locker;
  locker = new Redlock([createRedisClient(config)], {
    driftFactor: 0.01, // multiplied by lock ttl to determine drift time
    retryCount: 10,
    retryDelay: 200, // time in ms
    retryJitter: 200, // time in ms
    automaticExtensionThreshold: 500, // time in ms
  });

  return locker;
}

export const REDIS_LOCKER_TOKEN = 'redis-locker-token';
