import { MigrationInterface, QueryRunner } from 'typeorm';

export class MainWallet1733595573314 implements MigrationInterface {
  name = 'MainWallet1733595573314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "main_wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a5e67b15bd3fa73bb55def484a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_c60570051d297d8269fcdd9bc47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_c60570051d297d8269fcdd9bc47"`,
    );
    await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "userId"`);
    await queryRunner.query(`DROP TABLE "main_wallet"`);
  }
}
