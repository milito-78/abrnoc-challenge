import { IUser, User } from '../../../domains/user.domain';

export interface IUsersReader {
  get(id: string): Promise<User>;
  getByEmail(email: string): Promise<User>;
}

export interface IUsersWriter {
  store(user: IUser): Promise<User>;
}

export interface IUsersProvider extends IUsersReader, IUsersWriter {}

export const USERS_DATABASE_PROVIDER = 'users-database-provider';
