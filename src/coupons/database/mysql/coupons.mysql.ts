import { ListInterface } from '../../../common/interfaces/list.interface';
import { Coupon } from '../../../domains/coupon.domain';
import { ICouponsProvider } from '../providers/coupons.provider';
import { Repository } from 'typeorm';
import { CouponsEntity } from './schemas/coupons.schema';
import { CouponUsersEntity } from './schemas/coupon-user.schema';

export class CouponsMysqlRepository implements ICouponsProvider {
  constructor(
    private couponRepository: Repository<CouponsEntity>,
    private couponUsersRepository: Repository<CouponUsersEntity>,
  ) {}

  async getByCode(code: string): Promise<Coupon> {
    const result = await this.couponRepository.findOneBy({
      code: code,
    });
    if (!result) return null;

    return CouponsEntity.toDomain(result);
  }

  async getById(id: string): Promise<Coupon> {
    const result = await this.couponRepository.findOneBy({
      id: Number(id),
    });
    if (!result) return null;

    return CouponsEntity.toDomain(result);
  }

  async list(): Promise<ListInterface<Coupon>> {
    const result = await this.couponRepository.find();
    return {
      data: result.map<Coupon>((item) => CouponsEntity.toDomain(item)),
    };
  }

  async listForUser(userId: string): Promise<ListInterface<Coupon>> {
    const result = await this.couponRepository
      .createQueryBuilder('cpn')
      .leftJoinAndSelect(
        'cpn.users',
        'usr',
        'cpn.id = usr.coupon_id and usr.user_id = :usrd',
        { usrd: userId },
      )
      .getMany();

    return {
      data: result.map<Coupon>((item) => {
        const tmp = CouponsEntity.toDomain(item);
        tmp.usedBefore = !!item.users.length;
        return tmp;
      }),
    };
  }

  async doesUserUsedBefore(couponId: string, userId: string): Promise<boolean> {
    const result = await this.couponUsersRepository.findOneBy({
      couponId: Number(couponId),
      userId: Number(userId),
    });
    return !!result;
  }

  async getCapacity(couponId: string): Promise<number> {
    const result = await this.couponRepository.findOneBy({
      id: Number(couponId),
    });

    return result.totalCount - result.usedCount;
  }

  async useItByUser(
    couponId: string,
    userId: string,
    serverId: string,
  ): Promise<boolean> {
    const coupon = await this.couponRepository.findOneBy({
      id: Number(couponId),
    });
    if (!coupon) return false;
    const queryRunner =
      this.couponRepository.manager.connection.createQueryRunner();

    let result = false;
    await queryRunner.startTransaction();
    try {
      await this.couponRepository.update(coupon.id, {
        usedCount: coupon.usedCount + 1,
      });
      const user = new CouponUsersEntity();
      user.userId = Number(userId);
      user.couponId = coupon.id;
      user.usedCount = coupon.usedCount + 1;
      user.serverId = Number(serverId);
      await this.couponUsersRepository.save(user);
      await queryRunner.commitTransaction();
      result = true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return result;
  }
}
