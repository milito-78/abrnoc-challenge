import { Coupon } from '../../../domains/coupon.domain';
import { ListInterface } from '../../../common/interfaces/list.interface';

export interface ICouponsReader {
  getByCode(code: string): Promise<Coupon>;
  getById(id: string): Promise<Coupon>;
  list(): Promise<ListInterface<Coupon>>;
  doesUserUsedBefore(couponId: string, userId: string): Promise<boolean>;
  getCapacity(couponId: string): Promise<number>;
}

export interface ICouponsWriter {
  useItByUser(couponId: string, userId: string): Promise<boolean>;
}

export interface ICouponsProvider extends ICouponsReader, ICouponsWriter {}

export const COUPONS_DATABASE_PROVIDER = 'coupons-database-provider';
