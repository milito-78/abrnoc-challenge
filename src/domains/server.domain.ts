import { IEntity } from '../common/interfaces/entity.interface';
import { IDated } from '../common/interfaces/dated.interface';

export interface IServer {
  name: string;
  slug: string;
  cpu: string;
  ram: string;
  os: string;
}

export interface Server extends IServer, IEntity, IDated {}
