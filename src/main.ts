import dotenv from 'dotenv';
import { containerResolve, start } from './app.module';
import { AccessTokenService } from './auth/services/access-token.service';
import {
  ACCESS_TOKEN_DATABASE_PROVIDER,
  IAccessTokenReader,
  IAccessTokenWriter,
} from './auth/database/providers/access-token.database.provider';

dotenv.config();

async function main() {
  await start();
  const servive = new AccessTokenService(
    containerResolve<IAccessTokenReader>(ACCESS_TOKEN_DATABASE_PROVIDER),
    containerResolve<IAccessTokenWriter>(ACCESS_TOKEN_DATABASE_PROVIDER),
  );

  const result = await servive.verify('toke');
  console.log(result);
}

main();
