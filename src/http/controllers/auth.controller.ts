import { Request, Response } from 'express';
import { UsersService } from '../../users/services/users.service';
import { AccessTokenService } from '../../auth/services/access-token.service';
import { validationResult } from 'express-validator';
import { RegisterDto, RegisterResponseDto } from '../dto/register.dto';
import { userFromDomain } from '../dto/user.dto';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import {
  badRequestResponse,
  messageResponse,
  noContent,
  response,
  validationResponse,
} from '../../infrastructure/http/response.http';
import { StdStatus } from '../../infrastructure/http/std-status';
import { StdResponse } from '../../infrastructure/http/std-response';
import { tokenFromDomain } from '../dto/token.dto';

export class AuthController {
  constructor(
    private userService: UsersService,
    private tokenService: AccessTokenService,
  ) {}

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      validationResponse(res, errors.array());
      return;
    }
    const dto = req.body as RegisterDto;
    const found = await this.userService.getByEmail(dto.email);

    if (found.isOk()) {
      badRequestResponse(res, 'email registered before');
      return;
    }

    const result = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    if (result.isError()) {
      messageResponse(res, 'internal server error', StdStatus.InternalError);
      return;
    }

    const token = await this.tokenService.create(result.value.id);
    if (token.isError()) {
      messageResponse(
        res,
        'your registration complete, there is problem in generating token. Please login with your credentials',
        StdStatus.UNAUTHORIZED,
      );
      return;
    }

    response<RegisterResponseDto>(
      res,
      new StdResponse<RegisterResponseDto>(
        {
          user: userFromDomain(result.value),
          token: tokenFromDomain(token.value),
        },
        'registered successfully',
        StdStatus.Success,
      ),
      201,
    );
    return;
  }
  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      validationResponse(res, errors.array());
      return;
    }
    const dto = req.body as LoginDto;
    const found = await this.userService.checkPassword(dto.email, dto.password);

    if (found.isError()) {
      badRequestResponse(res, 'email or password is not valid');
      return;
    }

    const token = await this.tokenService.create(found.value.id);
    if (token.isError()) {
      messageResponse(res, 'internal server error', StdStatus.InternalError);
      return;
    }

    response<LoginResponseDto>(
      res,
      new StdResponse<LoginResponseDto>(
        {
          user: userFromDomain(found.value),
          token: tokenFromDomain(token.value),
        },
        'login successfully',
        StdStatus.Success,
      ),
    );
    return;
  }

  async logout(req: Request, res: Response) {
    //@ts-ignore
    const result = await this.tokenService.logout(req.authToken);
    if (result.isOk() && result.value) {
      noContent(res);
      return;
    }

    messageResponse(res, 'internal server error', StdStatus.InternalError);
    return;
  }
}
