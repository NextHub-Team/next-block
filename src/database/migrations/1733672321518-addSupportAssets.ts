import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupportAssets1733672321518 implements MigrationInterface {
  name = 'AddSupportAssets1733672321518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "supported_asset" ("protocol" character varying, "nativeAsset" character varying, "issuerAddress" character varying, "type" character varying NOT NULL, "decimals" integer, "contractAddress" character varying, "chainName" character varying NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_950dfa87ff1522d9cdce2e10181" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "supported_asset"`);
  }
}
