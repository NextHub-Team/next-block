import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustodialAddress1751452245487 implements MigrationInterface {
  name = 'AddCustodialAddress1751452245487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custodial_wallet" RENAME COLUMN "name" TO "custodialAddress"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custodial_wallet" RENAME COLUMN "custodialAddress" TO "name"`,
    );
  }
}
