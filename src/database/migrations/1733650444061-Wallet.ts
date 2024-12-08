import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wallet1733650444061 implements MigrationInterface {
  name = 'Wallet1733650444061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "passphrase" ("location" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1768f39c05609bb76464bfd0f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD "passphraseId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD CONSTRAINT "UQ_c75188c2165fb64d36e04861a43" UNIQUE ("passphraseId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD CONSTRAINT "FK_c75188c2165fb64d36e04861a43" FOREIGN KEY ("passphraseId") REFERENCES "passphrase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD CONSTRAINT "FK_7b0f82347ae332601a540247b2b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "main_wallet" DROP CONSTRAINT "FK_7b0f82347ae332601a540247b2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" DROP CONSTRAINT "FK_c75188c2165fb64d36e04861a43"`,
    );
    await queryRunner.query(`ALTER TABLE "main_wallet" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "main_wallet" DROP CONSTRAINT "UQ_c75188c2165fb64d36e04861a43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" DROP COLUMN "passphraseId"`,
    );
    await queryRunner.query(`ALTER TABLE "main_wallet" DROP COLUMN "address"`);
    await queryRunner.query(`DROP TABLE "passphrase"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
  }
}
