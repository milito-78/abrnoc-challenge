import { CouponTypeEnum } from './enums/coupon-type.enum';
import { IEntity } from '../common/interfaces/entity.interface';
import { IDated } from '../common/interfaces/dated.interface';

export interface ICoupon {
  title: string;
  code: string;
  typeId: CouponTypeEnum;
  typeableId?: number;
  amount: number;
  totalCount: number;
  usedCount: number;
}

export interface Coupon extends ICoupon, IEntity, IDated {}
