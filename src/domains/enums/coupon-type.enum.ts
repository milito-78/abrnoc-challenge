export enum CouponTypeEnum {
  Price = 1,
  Server,
}

export function getTitleFromValue(value: CouponTypeEnum): string {
  switch (value) {
    case CouponTypeEnum.Price:
      return 'price';
    case CouponTypeEnum.Server:
      return 'server';
    default:
      return 'unknown';
  }
}
