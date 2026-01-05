import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFireBlocksCwWallets1754154339132 implements MigrationInterface {
  name = 'AddFireBlocksCwWallets1754154339132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fireblocks_cw_wallet" ("accountId" uuid NOT NULL, "assetId" character varying NOT NULL, "address" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_146f8e1a2b5bef2f6fa9b56fab9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "fireblocks_cw_wallet"`);
  }
}
