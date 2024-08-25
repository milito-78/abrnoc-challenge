import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coupon } from '../../../../domains/coupon.domain';
import { CouponUsersEntity } from './coupon-user.schema';
import { CouponTypeEnum } from '../../../../domains/enums/coupon-type.enum';

@Entity()
@Index('code_unique', ['code'], { unique: true })
export class CouponsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ type: 'bigint', nullable: false })
  typeId: number;

  @Column({ type: 'bigint', nullable: true })
  typeableId?: number;

  @Column({ type: 'bigint', nullable: false, unsigned: true })
  amount: number;

  @Column({ type: 'int', nullable: false })
  totalCount: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  usedCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => CouponUsersEntity, (x) => x.coupon, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: CouponUsersEntity[];

  static toDomain(coupon: CouponsEntity): Coupon {
    return {
      id: String(coupon.id),
      amount: coupon.amount,
      code: coupon.code,
      title: coupon.title,
      totalCount: coupon.totalCount,
      typeId: Number(coupon.typeId) as CouponTypeEnum,
      typeableId: String(coupon.typeableId),
      usedCount: coupon.usedCount,
      updatedAt: coupon.updatedAt,
      createdAt: coupon.createdAt,
    };
  }
}
