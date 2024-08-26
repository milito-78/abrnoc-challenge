import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponsEntity } from './coupons.schema';

@Entity('coupon_users')
@Index('used_unique', ['userId', 'couponId'], { unique: true })
export class CouponUsersEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: false, name: 'coupon_id' })
  couponId: number;

  @Column({ type: 'bigint', nullable: false, name: 'user_id' })
  userId: number;

  @Column({ type: 'int', nullable: false, name: 'used_count' })
  usedCount: number;

  @Column({ type: 'bigint', nullable: true, name: 'server_id' })
  serverId?: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CouponsEntity, (x) => x.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon: CouponsEntity;
}
