import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveFireblocksNcwWallet1767000000000
  implements MigrationInterface
{
  name = 'RemoveFireblocksNcwWallet1767000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "fireblocks_ncw_wallet"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fireblocks_ncw_wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c57b43f0aa40bdd82204f159f0d" PRIMARY KEY ("id"))`,
    );
  }
}
