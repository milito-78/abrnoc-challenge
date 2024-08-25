import { Router } from 'express';
import { containerResolve } from '../app.module';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from '../users/services/users.service';
import {
  IUsersReader,
  IUsersWriter,
  USERS_DATABASE_PROVIDER,
} from '../users/database/providers/users.provider';
import { AccessTokenService } from '../auth/services/access-token.service';
import {
  ACCESS_TOKEN_DATABASE_PROVIDER,
  IAccessTokenReader,
  IAccessTokenWriter,
} from '../auth/database/providers/access-token.database.provider';
import { CouponsService } from '../coupons/services/coupons.service';
import {
  COUPONS_DATABASE_PROVIDER,
  ICouponsReader,
  ICouponsWriter,
} from '../coupons/database/providers/coupons.provider';
import Redlock from 'redlock';
import { REDIS_LOCKER_TOKEN } from '../infrastructure/redis/lock';
import { CouponsController } from './controllers/coupons.controller';
import { UsersController } from './controllers/users.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ServersService } from '../servers/services/servers.service';
import {
  IServersReader,
  IServersWriter,
  SERVERS_DATABASE_PROVIDER,
} from '../servers/database/providers/servers.provider';
import { CouponUseDto } from './dto/coupon-use.dto';
import { ServersController } from './controllers/servers.controller';

let serversService: ServersService;
let usersService: UsersService;
let authService: AccessTokenService;
let couponsService: CouponsService;

function initServices() {
  authService = new AccessTokenService(
    containerResolve<IAccessTokenReader>(ACCESS_TOKEN_DATABASE_PROVIDER),
    containerResolve<IAccessTokenWriter>(ACCESS_TOKEN_DATABASE_PROVIDER),
  );

  usersService = new UsersService(
    containerResolve<IUsersReader>(USERS_DATABASE_PROVIDER),
    containerResolve<IUsersWriter>(USERS_DATABASE_PROVIDER),
  );

  serversService = new ServersService(
    containerResolve<IServersReader>(SERVERS_DATABASE_PROVIDER),
    containerResolve<IServersWriter>(SERVERS_DATABASE_PROVIDER),
  );

  couponsService = new CouponsService(
    containerResolve<ICouponsReader>(COUPONS_DATABASE_PROVIDER),
    containerResolve<ICouponsWriter>(COUPONS_DATABASE_PROVIDER),
    containerResolve<Redlock>(REDIS_LOCKER_TOKEN),
  );
}

function registerAuthRoutes() {
  const authController = new AuthController(usersService, authService);
  const router = Router();
  const authMiddleware = new AuthMiddleware(authService, usersService);

  router.post(
    '/register',
    RegisterDto.validator(),
    authController.register.bind(authController),
  );
  router.post(
    '/login',
    LoginDto.validator(),
    authController.login.bind(authController),
  );

  router.use(authMiddleware.middleware.bind(authMiddleware));
  router.delete('/logout', authController.logout.bind(authController));

  return router;
}

function registerCouponsRoutes() {
  const couponsController = new CouponsController(
    couponsService,
    serversService,
  );
  const authMiddleware = new AuthMiddleware(authService, usersService);

  const router = Router();
  router.use(authMiddleware.middleware.bind(authMiddleware));
  router.get('/', couponsController.list.bind(couponsController));
  router.post(
    '/',
    CouponUseDto.validator(),
    couponsController.useIt.bind(couponsController),
  );

  return router;
}

function registerUsersRoutes() {
  const usersController = new UsersController(usersService);
  const authMiddleware = new AuthMiddleware(authService, usersService);
  const router = Router();
  router.use(authMiddleware.middleware.bind(authMiddleware));

  router.get('/profile', usersController.profile.bind(usersController));

  return router;
}

function registerServersRoutes() {
  const serversController = new ServersController(serversService);
  const router = Router();
  router.get('/', serversController.list.bind(serversController));

  return router;
}

export function registerV1Routes() {
  initServices();

  const v1 = Router();

  v1.use('/auth', registerAuthRoutes());
  v1.use('/users', registerUsersRoutes());
  v1.use('/coupons', registerCouponsRoutes());
  v1.use('/servers', registerServersRoutes());

  return v1;
}
