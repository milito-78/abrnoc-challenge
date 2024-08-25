import {
  IServersReader,
  IServersWriter,
} from '../database/providers/servers.provider';
import { Err, Ok, Result } from '../../common/result';
import { Server } from '../../domains/server.domain';
import { ListInterface } from '../../common/interfaces/list.interface';
import { GenericErrorCode } from '../../common/errors/generic-error';

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

  async listById(serverIds: string[]): Promise<Result<ListInterface<Server>>> {
    return Ok<ListInterface<Server>>(
      await this.serversRead.listById(serverIds),
    );
  }
}
