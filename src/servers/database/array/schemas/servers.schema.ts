import { Server } from '../../../../domains/server.domain';

export class ServerEntity {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public cpu: string,
    public ram: string,
    public os: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static toDomain(server: ServerEntity): Server {
    return {
      cpu: server.cpu,
      createdAt: server.createdAt,
      id: String(server.id),
      name: server.name,
      os: server.os,
      ram: server.ram,
      slug: server.slug,
      updatedAt: server.updatedAt,
    };
  }
}
