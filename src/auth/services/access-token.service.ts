import {
  IAccessTokenReader,
  IAccessTokenWriter,
} from '../database/providers/access-token.database.provider';
import { AccessToken } from '../../domains/access_token.domain';
import { Err, Ok, Result } from '../../common/result';
import { GenericErrorCode } from '../../common/errors/generic-error';

export class AccessTokenService {
  constructor(
    private tokenReader: IAccessTokenReader,
    private tokenWriter: IAccessTokenWriter,
  ) {}

  async create(userId: string): Promise<Result<AccessToken>> {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const result = await this.tokenWriter.store({
      expiredAt: date,
      token: this.#generateToken(),
      userId: userId,
    });

    if (!result) {
      return Err('record not found', GenericErrorCode.NOT_FOUND);
    }

    return Ok<AccessToken>(result);
  }

  async verify(token: string): Promise<Result<AccessToken>> {
    const result = await this.tokenReader.get(token);
    if (!result) {
      return Err('record not found', GenericErrorCode.NOT_FOUND);
    }

    return Ok<AccessToken>(result);
  }

  #generateToken(length = 60): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomPartLength = length - 10; // Adjust as needed
    const randomPart = Array.from({ length: randomPartLength }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('');

    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    return `${timestamp}${randomPart}`;
  }
}
