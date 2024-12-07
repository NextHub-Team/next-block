import { MigrationInterface, QueryRunner } from 'typeorm';

export class Permission1733591218179 implements MigrationInterface {
  name = 'Permission1733591218179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
