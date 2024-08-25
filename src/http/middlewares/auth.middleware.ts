import { AccessTokenService } from '../../auth/services/access-token.service';
import { UsersService } from '../../users/services/users.service';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware {
  constructor(
    private authService: AccessTokenService,
    private userService: UsersService,
  ) {}

  async middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'un authenticate' });
    }

    const token = authHeader.split(' ')[1];
    const result = await this.authService.verify(token);
    if (result.isError())
      return res.status(401).json({ message: 'un authenticate' });
    const userResult = await this.userService.getById(result.value.userId);
    if (userResult.isError())
      return res.status(401).json({ message: 'un authenticate' });

    // @ts-ignore
    req.user = userResult.value;
    // @ts-ignore
    req.authToken = token;

    next();
  }
}
