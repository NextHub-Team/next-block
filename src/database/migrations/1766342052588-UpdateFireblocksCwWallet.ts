import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFireblocksCwWallet1766342052588
  implements MigrationInterface
{
  name = 'UpdateFireblocksCwWallet1766342052588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "referenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "metadata"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "customerRefId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "assets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "assets" jsonb`,
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
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "assets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "assets" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN "customerRefId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "metadata" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "referenceId" character varying NOT NULL`,
    );
  }
}
