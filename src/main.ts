import dotenv from 'dotenv';
import { containerResolve, start } from './app.module';
import { serve } from './http/server';
import { APP_CONFIG_TOKEN, IConfig } from './app.config';

dotenv.config();

async function main() {
  await start();
  await serve(containerResolve<IConfig>(APP_CONFIG_TOKEN));
}

main();
