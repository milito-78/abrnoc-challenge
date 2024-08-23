import {
  ICouponsReader,
  ICouponsWriter,
} from '../database/providers/coupons.provider';
import { Err, Ok, Result } from '../../common/result';
import { Coupon } from '../../domains/coupon.domain';
import { GenericErrorCode } from '../../common/errors/generic-error';
import Redlock from 'redlock';

export class CouponsService {
  constructor(
    private couponReader: ICouponsReader,
    private couponWriter: ICouponsWriter,
    private locker: Redlock,
  ) {}

  async getByCode(code: string): Promise<Result<Coupon>> {
    const result = await this.couponReader.getByCode(code);
    if (!result) return Err('record not found', GenericErrorCode.NOT_FOUND);
    return Ok<Coupon>(result);
  }

  async useCodeByUser(code: string, userId: string): Promise<Result<boolean>> {
    const coupon = await this.couponReader.getByCode(code);
    if (!coupon) return Err('record not found', GenericErrorCode.NOT_FOUND);

    let lock = await this.locker.acquire(
      [`coupon:${coupon.id}`, `coupon_user:${coupon.id}${userId}`],
      3000,
    );

    if (await this.couponReader.doesUserUsedBefore(coupon.id, userId)) {
      await lock.release();
      return Err(
        'You used this coupon before',
        GenericErrorCode.INVALID_ARGUMENT,
      );
    }

    if ((await this.couponReader.getCapacity(coupon.id)) - 1 < 0) {
      await lock.release();
      return Err(
        'coupon is out of capacity',
        GenericErrorCode.INVALID_ARGUMENT,
      );
    }

    let result = false;
    try {
      result = await this.couponWriter.useItByUser(coupon.id, userId);
    } catch (error) {
      return Err('internal error', GenericErrorCode.INTERNAL);
    } finally {
      await lock.release();
    }

    return Ok<boolean>(result);
  }
}
