import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssetRegistry1767783917741 implements MigrationInterface {
  name = 'AddAssetRegistry1767783917741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP CONSTRAINT "FK_c5263cfcc12b23f3cd47b8f8804"`,
    );
    await queryRunner.query(
      `CREATE TABLE "asset_registry" ("description" character varying, "providerName" character varying, "envType" character varying, "chainName" character varying NOT NULL, "assetId" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93fa5d1e02e74bccec84f73b4cc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "walletId"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."sleeves_transaction_type_enum" RENAME TO "sleeves_transaction_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sleeves_transaction_type_enum" AS ENUM('transferIn', 'transferOut')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ALTER COLUMN "type" TYPE "public"."sleeves_transaction_type_enum" USING "type"::"text"::"public"."sleeves_transaction_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ALTER COLUMN "type" SET DEFAULT 'transferIn'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."sleeves_transaction_type_enum_old"`,
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
      `CREATE TYPE "public"."sleeves_transaction_type_enum_old" AS ENUM('transferIn', 'transferOut')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ALTER COLUMN "type" TYPE "public"."sleeves_transaction_type_enum_old" USING "type"::"text"::"public"."sleeves_transaction_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ALTER COLUMN "type" SET DEFAULT 'transferIn'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."sleeves_transaction_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."sleeves_transaction_type_enum_old" RENAME TO "sleeves_transaction_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "walletId" uuid NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "asset_registry"`);
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD CONSTRAINT "FK_c5263cfcc12b23f3cd47b8f8804" FOREIGN KEY ("walletId") REFERENCES "fireblocks_cw_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
