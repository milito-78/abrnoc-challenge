import { IDated } from '../common/interfaces/dated.interface';
import { IEntity } from '../common/interfaces/entity.interface';

export interface IAccessToken {
  token: string;
  expiredAt: Date;
  userId: string;
}

export interface AccessToken extends IAccessToken, IEntity, IDated {}
