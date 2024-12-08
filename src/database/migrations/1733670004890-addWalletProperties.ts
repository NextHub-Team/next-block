import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletProperties1733670004890 implements MigrationInterface {
  name = 'AddWalletProperties1733670004890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD "type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "legacyAddress" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "blockchain" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "address" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "blockchain"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "legacyAddress"`);
    await queryRunner.query(`ALTER TABLE "main_wallet" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "main_wallet" DROP COLUMN "type"`);
  }
}
