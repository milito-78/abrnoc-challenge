import {
  IServersReader,
  IServersWriter,
} from '../database/providers/servers.provider';
import { Err, Ok, Result } from '../../common/result';
import { Server } from '../../domains/server.domain';
import { ListInterface } from '../../common/interfaces/list.interface';
import { GenericErrorCode } from '../../common/errors/generic-error';
import { User } from '../../domains/user.domain';

export class ServersService {
  constructor(
    private serversRead: IServersReader,
    private serversWriter: IServersWriter,
  ) {}

  async list(): Promise<Result<ListInterface<Server>>> {
    return Ok<ListInterface<Server>>(await this.serversRead.list());
  }

  async getBySlug(slug: string): Promise<Result<Server>> {
    const result = await this.serversRead.getBySlug(slug);
    if (!result) {
      return Err('record not found', GenericErrorCode.NOT_FOUND);
    }

    return Ok<Server>(result);
  }
}
