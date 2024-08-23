export enum CouponTypeEnum {
  Price = 1,
  Server,
}

export function tryFromValue(value: number): CouponTypeEnum {
  switch (value) {
    case CouponTypeEnum.Price:
      return CouponTypeEnum.Price;
  }
}
