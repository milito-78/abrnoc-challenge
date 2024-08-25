import { Request, Response } from 'express';
import { CouponsService } from '../../coupons/services/coupons.service';
import { validationResult } from 'express-validator';
import { CouponUseDto } from '../dto/coupon-use.dto';
import { ServersService } from '../../servers/services/servers.service';
import { CouponTypeEnum } from '../../domains/enums/coupon-type.enum';
import {
  badRequestResponse,
  messageResponse,
  responseResult,
  validationResponse,
} from '../../infrastructure/http/response.http';
import { StdStatus } from '../../infrastructure/http/std-status';
import { Ok } from '../../common/result';
import { Server } from '../../domains/server.domain';
import { couponFromDomain, CouponResponseDto } from '../dto/coupon.dto';

export class CouponsController {
  constructor(
    private couponService: CouponsService,
    private serverService: ServersService,
  ) {}

  async list(req: Request, res: Response) {
    //@ts-ignore
    const user = req.user;
    const list = await this.couponService.listForUser(user.id);
    const serverIds: string[] = [];
    list.value.data.forEach((coupon) => {
      if (coupon.typeId == CouponTypeEnum.Server) {
        serverIds.push(coupon.typeableId);
      }
    });

    const serverList = await this.serverService.listById(serverIds);
    const serverHashMap: { [key: string]: Server } =
      serverList.value.data.reduce((acc, item) => {
        return Object.assign(acc, { [item.id]: item });
      }, {});

    const response: CouponResponseDto[] = [];
    list.value.data.forEach((coupon) => {
      if (
        coupon.typeId == CouponTypeEnum.Server &&
        serverHashMap[coupon.typeableId]
      ) {
        coupon.server = serverHashMap[coupon.typeableId];
      }
      response.push(couponFromDomain(coupon));
    });

    responseResult<CouponResponseDto[]>(res, Ok<CouponResponseDto[]>(response));
    return;
  }

  async useIt(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      validationResponse(res, errors.array());
      return;
    }

    const dto = req.body as CouponUseDto;
    const foundServer = await this.serverService.getBySlug(dto.serverSlug);
    if (foundServer.isError()) {
      badRequestResponse(res, 'invalid server');
      return;
    }

    const couponResult = await this.couponService.getByCode(dto.couponCode);
    if (couponResult.isError()) {
      badRequestResponse(res, 'invalid coupon');
      return;
    } else if (
      couponResult.value.typeId == CouponTypeEnum.Server &&
      couponResult.value.typeableId != foundServer.value.id
    ) {
      badRequestResponse(res, 'coupon is not available for selected server');
      return;
    }

    //@ts-ignore
    const user = req.user;
    const useResult = await this.couponService.useCodeByUser(
      dto.couponCode,
      user.id,
      foundServer.value.id,
    );

    if (useResult.isError()) {
      responseResult<boolean>(res, useResult);
      return;
    }

    messageResponse(res, 'successfully used for you', StdStatus.Success);
    return;
  }
}
