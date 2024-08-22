import { IAccessTokenProvider } from '../providers/access-token.database.provider';
import { Repository } from 'typeorm';
import { TokenEntity } from './schemas/access-token.schema';
import {
  AccessToken,
  IAccessToken,
} from '../../../domains/access_token.domain';

export class AccessTokenMysqlRepository implements IAccessTokenProvider {
  constructor(private repository: Repository<TokenEntity>) {}

  async get(token: string): Promise<AccessToken> {
    const result = await this.repository.findOneBy({
      token: token,
    });
    if (!result) return null;

    return TokenEntity.toDomain(result);
  }

  async store(token: IAccessToken): Promise<AccessToken> {
    const result = await this.repository.save(TokenEntity.fromDomain(token));
    return TokenEntity.toDomain(result);
  }
}
