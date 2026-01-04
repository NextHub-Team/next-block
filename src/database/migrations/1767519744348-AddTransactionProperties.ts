import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionProperties1767519744348
  implements MigrationInterface
{
  name = 'AddTransactionProperties1767519744348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "tag" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "chainName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "contractAddress" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD "sleeveId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sleeves_transaction_type_enum" AS ENUM('transferIn', 'transferOut')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "type" "public"."sleeves_transaction_type_enum" NOT NULL DEFAULT 'transferIn'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sleeves_transaction_point_type_enum" AS ENUM('reward', 'status', 'subscription')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "pointType" "public"."sleeves_transaction_point_type_enum" NOT NULL DEFAULT 'reward'`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "txHash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "pointCount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "blockNumber" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "walletId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD "sleeveId" uuid NOT NULL`,
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
      `ALTER TABLE "internal_event" ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD CONSTRAINT "FK_c5263cfcc12b23f3cd47b8f8804" FOREIGN KEY ("walletId") REFERENCES "fireblocks_cw_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" ADD CONSTRAINT "FK_4aaa1fcd93fb8fa4b8441d68256" FOREIGN KEY ("sleeveId") REFERENCES "sleeves"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP CONSTRAINT "FK_4aaa1fcd93fb8fa4b8441d68256"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP CONSTRAINT "FK_c5263cfcc12b23f3cd47b8f8804"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_event" ALTER COLUMN "payload" SET DEFAULT '{}'`,
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
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "sleeveId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "walletId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "blockNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "pointCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "txHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "pointType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."sleeves_transaction_point_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves_transaction" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."sleeves_transaction_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "sleeveId"`);
    await queryRunner.query(
      `ALTER TABLE "sleeves" DROP COLUMN "contractAddress"`,
    );
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "chainName"`);
    await queryRunner.query(`ALTER TABLE "sleeves" DROP COLUMN "tag"`);
  }
}
