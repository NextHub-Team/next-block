import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSleevesProperties1767855666857
  implements MigrationInterface
{
  name = 'UpdateSleevesProperties1767855666857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "envType"`);
    await queryRunner.query(`DROP TYPE "public"."sleeves_env_type_enum"`);
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "chainName"`);
    await queryRunner.query(
      `ALTER TABLE "sleeves" DROP COLUMN "contractAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "assetId" uuid NOT NULL`,
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
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD CONSTRAINT "FK_9930783c9f5d5d1096f1a0fc38d" FOREIGN KEY ("assetId") REFERENCES "asset_registry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sleeves" DROP CONSTRAINT "FK_9930783c9f5d5d1096f1a0fc38d"`,
    );
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
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "assetId"`);
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "contractAddress" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "chainName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sleeves_env_type_enum" AS ENUM('testnet', 'mainnet')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "envType" "public"."sleeves_env_type_enum" NOT NULL DEFAULT 'testnet'`,
    );
  }
}
