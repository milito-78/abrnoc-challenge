import { ListInterface } from '../../../common/interfaces/list.interface';
import { Server } from '../../../domains/server.domain';

export interface IServersReader {
  list(): Promise<ListInterface<Server>>;
  get(id: string): Promise<Server>;
  getBySlug(slug: string): Promise<Server>;
  listById(serverIds: string[]): Promise<ListInterface<Server>>;
}

export interface IServersWriter {}

export interface IServersProvider extends IServersWriter, IServersReader {}

export const SERVERS_DATABASE_PROVIDER = 'servers-database-provider';
