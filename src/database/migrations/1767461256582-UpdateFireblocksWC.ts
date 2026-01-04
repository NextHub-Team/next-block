import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFireblocksWC1767461256582 implements MigrationInterface {
  name = 'UpdateFireblocksWC1767461256582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "autoFuel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "hiddenOnUI"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "assets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "assetId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_event" ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."account_status_enum" RENAME TO "account_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum" AS ENUM('active', 'deactivate')`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" TYPE "public"."account_status_enum" USING "status"::"text"::"public"."account_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."account_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum_old" AS ENUM('active', 'deactivate')`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" TYPE "public"."account_status_enum_old" USING "status"::"text"::"public"."account_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."account_status_enum_old" RENAME TO "account_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_event" ALTER COLUMN "payload" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "assetId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "assets" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "hiddenOnUI" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "autoFuel" boolean NOT NULL`,
    );
  }
}
