import { IEntity } from '../common/interfaces/entity.interface';
import { IDated } from '../common/interfaces/dated.interface';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface User extends IUser, IEntity, IDated {}
