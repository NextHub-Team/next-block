import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePropertiesName1734540739813 implements MigrationInterface {
  name = 'ChangePropertiesName1734540739813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft_transaction" RENAME COLUMN "gasFee" TO "fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" RENAME COLUMN "transaction_fee" TO "fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "transaction_fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "amount_out"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "amount_in"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "to_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "from_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" ADD "details" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" ADD "priority" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" ADD "assetName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "names" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "details" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "fee" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "amountOut" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "amountIn" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "toToken" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "fromToken" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "fromToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "toToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "amountIn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" DROP COLUMN "amountOut"`,
    );
    await queryRunner.query(`ALTER TABLE "swap_transaction" DROP COLUMN "fee"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "details"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "names"`);
    await queryRunner.query(
      `ALTER TABLE "transaction_log" DROP COLUMN "assetName"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction_log" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "transaction_log" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" DROP COLUMN "priority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" DROP COLUMN "details"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "from_token" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "to_token" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "amount_in" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "amount_out" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swap_transaction" ADD "transaction_fee" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" RENAME COLUMN "fee" TO "transaction_fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft_transaction" RENAME COLUMN "fee" TO "gasFee"`,
    );
  }
}
