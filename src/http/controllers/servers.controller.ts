import { Request, Response } from 'express';
import { response } from '../../infrastructure/http/response.http';
import { StdResponse } from '../../infrastructure/http/std-response';
import { StdStatus } from '../../infrastructure/http/std-status';
import { ServersService } from '../../servers/services/servers.service';
import { Server } from '../../domains/server.domain';

export class ServersController {
  constructor(private serversService: ServersService) {}

  async list(req: Request, res: Response) {
    const list = await this.serversService.list();

    response<Server[]>(
      res,
      new StdResponse<Server[]>(list.value.data, 'success', StdStatus.Success),
    );
    return;
  }
}
