import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAccountFromFireblocksCwWallet1766380316375
  implements MigrationInterface
{
  name = 'RemoveAccountFromFireblocksCwWallet1766380316375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP CONSTRAINT IF EXISTS "FK_fireblocks_cw_wallet_account"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP COLUMN IF EXISTS "accountId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD "accountId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD CONSTRAINT "FK_fireblocks_cw_wallet_account" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
