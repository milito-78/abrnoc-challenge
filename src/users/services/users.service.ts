import {
  IUsersReader,
  IUsersWriter,
} from '../database/providers/users.provider';
import { Err, Ok, Result } from '../../common/result';
import { IUser, User } from '../../domains/user.domain';
import { GenericErrorCode } from '../../common/errors/generic-error';
import * as bcrypt from 'bcrypt';

export class UsersService {
  constructor(
    private userReader: IUsersReader,
    private userWriter: IUsersWriter,
  ) {}

  async getById(id: string): Promise<Result<User>> {
    const result = await this.userReader.get(id);
    if (!result) {
      return Err('record not found', GenericErrorCode.NOT_FOUND);
    }

    return Ok<User>(result);
  }

  async getByEmail(email: string): Promise<Result<User>> {
    const result = await this.userReader.getByEmail(email);
    if (!result) {
      return Err('record not found', GenericErrorCode.NOT_FOUND);
    }

    return Ok<User>(result);
  }

  async checkPassword(email: string, password: string): Promise<Result<User>> {
    const result = await this.userReader.getByEmail(email);
    if (!result) {
      return Err('record not found', GenericErrorCode.NOT_FOUND);
    }

    if (await bcrypt.compare(password, result.password)) {
      return Ok<User>(result);
    }
    return Err(
      'username or password is invalid',
      GenericErrorCode.INVALID_ARGUMENT,
    );
  }

  async create(user: IUser): Promise<Result<User>> {
    user.password = bcrypt.hashSync(user.password, 10);

    const result = await this.userWriter.store(user);
    if (!result) {
      return Err('error during create new user.', GenericErrorCode.INTERNAL);
    }

    return Ok<User>(result);
  }
}
