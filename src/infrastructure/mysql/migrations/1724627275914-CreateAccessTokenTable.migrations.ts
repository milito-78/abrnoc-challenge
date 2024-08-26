import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TokenEntity } from '../../../auth/database/mysql/schemas/access-token.schema';

export class CreateAccessTokenTable1724627275914 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_tokens',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'varchar',
          },
          {
            name: 'expired_at',
            type: 'timestamp',
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
    const date = new Date();
    date.setDate(date.getDate() + 1);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(TokenEntity)
      .values([
        {
          userId: 1,
          token: 'cxcjjxbchcqdnw7cey67dadmjioc7dfec',
          expiredAt: date,
        },
        {
          userId: 2,
          token: 'sahdsghadwqydftsgdhajskhdsdhjss',
          expiredAt: date,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('access_tokens');
  }
}
