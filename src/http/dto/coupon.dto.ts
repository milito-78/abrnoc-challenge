import {
  CouponTypeEnum,
  getTitleFromValue,
} from '../../domains/enums/coupon-type.enum';
import { Server } from '../../domains/server.domain';
import { AccessToken } from '../../domains/access_token.domain';
import { Coupon } from '../../domains/coupon.domain';

export interface CouponResponseDto {
  title: string;
  code: string;
  typeId: CouponTypeEnum;
  typeLabel: string;
  server?: Server;
  amount: number;
  totalCount: number;
  usedCount: number;
  usedBefore?: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function couponFromDomain(domain: Coupon): CouponResponseDto {
  return {
    id: domain.id,
    amount: domain.amount,
    code: domain.code,
    title: domain.title,
    totalCount: domain.totalCount,
    typeId: domain.typeId,
    typeLabel: getTitleFromValue(domain.typeId),
    server: domain.server,
    usedBefore: domain.usedBefore,
    usedCount: domain.usedCount,
    updatedAt: domain.updatedAt,
    createdAt: domain.createdAt,
  };
}
