import { IServersProvider } from '../providers/servers.provider';
import { ServerEntity } from './schemas/servers.schema';
import { ListInterface } from '../../../common/interfaces/list.interface';
import { Server } from '../../../domains/server.domain';

const _servers = [
  new ServerEntity(
    1,
    'Server one',
    'server-one',
    'amd',
    'ddr4',
    'ubuntu 22',
    new Date(),
    new Date(),
  ),
  new ServerEntity(
    2,
    'Server two',
    'server-two',
    'intel',
    'ddr4',
    'centos 7',
    new Date(),
    new Date(),
  ),
  new ServerEntity(
    3,
    'Server three',
    'server-one',
    'intel',
    'ddr4',
    'windows server IIS',
    new Date(),
    new Date(),
  ),
];

export class ServersArrayRepository implements IServersProvider {
  _lists: ServerEntity[];
  constructor(servers: ServerEntity[] | null = null) {
    this._lists = servers === null ? _servers : servers;
  }

  async get(id: string): Promise<Server> {
    const tmp = Number(id);
    const result = this._lists.find((item) => item.id == tmp);
    if (result) return ServerEntity.toDomain(result);
    return null;
  }

  async getBySlug(slug: string): Promise<Server> {
    const result = this._lists.find((item) => item.slug == slug);
    if (result) return ServerEntity.toDomain(result);
    return null;
  }

  async list(): Promise<ListInterface<Server>> {
    return {
      data: this._lists.map<Server>((item) => ServerEntity.toDomain(item)),
    };
  }

  async listById(serverIds: string[]): Promise<ListInterface<Server>> {
    return {
      data: this._lists
        .filter((serve) => serverIds.includes(String(serve.id)))
        .map<Server>((item) => ServerEntity.toDomain(item)),
    };
  }
}
