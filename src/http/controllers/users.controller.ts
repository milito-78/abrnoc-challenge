import { Request, Response } from 'express';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../domains/user.domain';
import { userFromDomain, UserDto } from '../dto/user.dto';
import { response } from '../../infrastructure/http/response.http';
import { StdResponse } from '../../infrastructure/http/std-response';
import { StdStatus } from '../../infrastructure/http/std-status';

export class UsersController {
  constructor(private userService: UsersService) {}

  async profile(req: Request, res: Response) {
    //@ts-ignore
    const user: User = req.user as User;

    response<UserDto>(
      res,
      new StdResponse<UserDto>(
        userFromDomain(user),
        'success',
        StdStatus.Success,
      ),
    );
    return;
  }
}
