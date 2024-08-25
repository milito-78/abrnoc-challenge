import { body } from 'express-validator';

export class CouponUseDto {
  couponCode: string;
  serverSlug: string;

  static validator() {
    return [
      body('couponCode').isString().withMessage('Invalid code'),
      body('serverSlug').isString().withMessage('Invalid server'),
    ];
  }
}
