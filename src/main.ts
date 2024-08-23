import dotenv from 'dotenv';
import { containerResolve, start } from './app.module';
import { CouponsService } from './coupons/services/coupons.service';
import {
  COUPONS_DATABASE_PROVIDER,
  ICouponsReader,
  ICouponsWriter,
} from './coupons/database/providers/coupons.provider';
import Redlock from 'redlock';
import { REDIS_LOCKER_TOKEN } from './infrastructure/redis/lock';

dotenv.config();

async function main() {
  await start();
  const servive = new CouponsService(
    containerResolve<ICouponsReader>(COUPONS_DATABASE_PROVIDER),
    containerResolve<ICouponsWriter>(COUPONS_DATABASE_PROVIDER),
    containerResolve<Redlock>(REDIS_LOCKER_TOKEN),
  );

  const result = await servive.getByCode('code');
  console.log(result);
}

main();
