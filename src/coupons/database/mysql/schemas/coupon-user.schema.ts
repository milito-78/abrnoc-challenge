import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponsEntity } from './coupons.schema';

@Entity()
export class CouponUsersEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: false })
  couponId: number;

  @Column({ type: 'bigint', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  usedCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => CouponsEntity, (x) => x.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  coupon: CouponsEntity;
}
