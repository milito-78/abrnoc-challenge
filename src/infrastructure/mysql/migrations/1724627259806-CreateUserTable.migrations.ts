import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UserEntity } from '../../../users/database/mysql/schemas/users.schema';

export class CreateUserTable1724627259806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
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

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          name: 'user 1',
          email: 'email1@coupon.co',
          password:
            '$2a$10$JxzlZ8u9MIDXaA2Ksu.JueOGsHdjuoFy/S8BpYQjEY.hrUcTaNjqy', //Mm@123Coupon
        },
        {
          name: 'user 2',
          email: 'email2@coupon.co',
          password:
            '$2a$10$JxzlZ8u9MIDXaA2Ksu.JueOGsHdjuoFy/S8BpYQjEY.hrUcTaNjqy', //Mm@123Coupon
        },
        {
          name: 'user 3',
          email: 'email3@coupon.co',
          password:
            '$2a$10$JxzlZ8u9MIDXaA2Ksu.JueOGsHdjuoFy/S8BpYQjEY.hrUcTaNjqy', //Mm@123Coupon
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
