import {
  AccessToken,
  IAccessToken,
} from '../../../domains/access_token.domain';

export interface IAccessTokenReader {
  get(token: string): Promise<AccessToken>;
}

export interface IAccessTokenWriter {
  store(token: IAccessToken): Promise<AccessToken>;
}

export interface IAccessTokenProvider
  extends IAccessTokenReader,
    IAccessTokenWriter {}

export const ACCESS_TOKEN_DATABASE_PROVIDER = 'access-token-database-provider';
