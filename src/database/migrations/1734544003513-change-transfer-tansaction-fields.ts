import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTransferTansactionFields1734544003513
  implements MigrationInterface
{
  name = 'ChangeTransferTansactionFields1734544003513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft_transaction" RENAME COLUMN "gasFee" TO "fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "transaction_fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "from_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "to_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "transaction_hash"`,
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
      `ALTER TABLE "transfer_transaction" ADD "fromAddress" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" ADD "toAddress" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" ADD "fee" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" ADD "transactionHash" character varying NOT NULL`,
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
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "transactionHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "toAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" DROP COLUMN "fromAddress"`,
    );
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
      `ALTER TABLE "transfer_transaction" ADD "transaction_hash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" ADD "to_address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" ADD "from_address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_transaction" ADD "transaction_fee" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft_transaction" RENAME COLUMN "fee" TO "gasFee"`,
    );
  }
}
