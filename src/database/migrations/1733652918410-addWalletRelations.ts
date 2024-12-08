import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletRelations1733652918410 implements MigrationInterface {
  name = 'AddWalletRelations1733652918410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "mainWalletId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_0017ef91c935a7df25f051c36f7" FOREIGN KEY ("mainWalletId") REFERENCES "main_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_0017ef91c935a7df25f051c36f7"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "mainWalletId"`);
  }
}
