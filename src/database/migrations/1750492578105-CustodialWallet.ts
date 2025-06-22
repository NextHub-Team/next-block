import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustodialWallet1750492578105 implements MigrationInterface {
  name = 'CustodialWallet1750492578105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "custodial_wallet" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "vaultId" character varying NOT NULL,
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer NOT NULL,
        CONSTRAINT "PK_5b4fbbd2cc85f4d1c26d531e1ee" PRIMARY KEY ("id"),
        CONSTRAINT "REL_b500df5023c585ab20c5ea1cee" UNIQUE ("userId"),
        CONSTRAINT "FK_b500df5023c585ab20c5ea1ceef" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "custodial_wallet"
    `);
  }
}
