import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { CouponTypeEnum } from '../../../domains/enums/coupon-type.enum';
import { CouponTypesEntity } from '../../../coupons/database/mysql/schemas/coupon-type.schema';

export class CreateCouponTypesTable1724627304228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coupon_types',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.manager.save([
      queryRunner.manager.create(CouponTypesEntity, {
        id: CouponTypeEnum.Price,
        title: 'Price',
      }),
      queryRunner.manager.create(CouponTypesEntity, {
        id: CouponTypeEnum.Server,
        title: 'Server',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('coupon_types');
  }
}
