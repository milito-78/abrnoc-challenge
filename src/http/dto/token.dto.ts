import { User } from '../../domains/user.domain';
import { UserDto } from './user.dto';
import { AccessToken } from '../../domains/access_token.domain';

export interface TokenDto {
  id: string;
  token: string;
  type: 'Bearer';
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function tokenFromDomain(domain: AccessToken): TokenDto {
  return {
    createdAt: domain.createdAt,
    expiredAt: domain.expiredAt,
    id: domain.id,
    token: domain.token,
    type: 'Bearer',
    updatedAt: domain.updatedAt,
  };
}
