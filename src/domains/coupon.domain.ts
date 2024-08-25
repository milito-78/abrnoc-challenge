import { CouponTypeEnum } from './enums/coupon-type.enum';
import { IEntity } from '../common/interfaces/entity.interface';
import { IDated } from '../common/interfaces/dated.interface';
import { Server } from './server.domain';

export interface ICoupon {
  title: string;
  code: string;
  typeId: CouponTypeEnum;
  typeableId?: string;
  server?: Server;
  amount: number;
  totalCount: number;
  usedCount: number;
  usedBefore?: boolean;
}

export interface Coupon extends ICoupon, IEntity, IDated {}
