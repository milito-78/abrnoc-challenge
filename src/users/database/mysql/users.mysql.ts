import { User, IUser } from '../../../domains/user.domain';
import { IUsersProvider } from '../providers/users.provider';
import { Repository } from 'typeorm';
import { UserEntity } from './schemas/users.schema';

export class UsersMysqlRepository implements IUsersProvider {
  constructor(private repository: Repository<UserEntity>) {}

  async get(id: string): Promise<User> {
    const result = await this.repository.findOneBy({
      id: Number(id),
    });
    if (!result) return null;

    return UserEntity.toDomain(result);
  }
  async getByEmail(email: string): Promise<User> {
    const result = await this.repository.findOneBy({
      email: email,
    });
    if (!result) return null;

    return UserEntity.toDomain(result);
  }

  async store(user: IUser): Promise<User> {
    const result = await this.repository.save(UserEntity.fromDomain(user));
    return UserEntity.toDomain(result);
  }
}
