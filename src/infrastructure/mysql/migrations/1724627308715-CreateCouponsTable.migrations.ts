import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { CouponsEntity } from '../../../coupons/database/mysql/schemas/coupons.schema';
import { CouponTypeEnum } from '../../../domains/enums/coupon-type.enum';

export class CreateCouponsTable1724627308715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coupons',
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
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'type_id',
            type: 'bigint',
          },
          {
            name: 'typeable_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'total_count',
            type: 'int',
            default: 1,
          },
          {
            name: 'used_count',
            type: 'int',
            default: 0,
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

    await queryRunner.createForeignKey(
      'coupons',
      new TableForeignKey({
        columnNames: ['type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coupon_types',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(CouponsEntity)
      .values([
        {
          title: 'First coupon',
          code: 'frst1',
          typeId: CouponTypeEnum.Price,
          amount: 100000,
          totalCount: 10,
        },
        {
          title: 'Second coupon',
          code: 'frst2',
          typeId: CouponTypeEnum.Price,
          amount: 50000,
          totalCount: 2,
        },
        {
          title: 'Server coupon',
          code: 'serv1',
          typeId: CouponTypeEnum.Server,
          typeableId: 1,
          amount: 10,
          totalCount: 20,
        },
        {
          title: 'Server coupon 3',
          code: 'serv3',
          typeId: CouponTypeEnum.Server,
          typeableId: 3,
          amount: 15,
          totalCount: 20,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('coupons');
  }
}
