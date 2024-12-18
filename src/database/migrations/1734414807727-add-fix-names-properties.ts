import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFixNamesProperties1734414807727 implements MigrationInterface {
  name = 'AddFixNamesProperties1734414807727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supported_asset" RENAME COLUMN "chainName" TO "blockchain"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "status" character varying NOT NULL DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "processed" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "newValue" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "oldValue" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "property" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "entity" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD "userLogId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD CONSTRAINT "UQ_d44c8bed510197c58a67563b30b" UNIQUE ("userLogId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" ADD CONSTRAINT "FK_d44c8bed510197c58a67563b30b" FOREIGN KEY ("userLogId") REFERENCES "user_log"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_log" DROP CONSTRAINT "FK_d44c8bed510197c58a67563b30b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_log" DROP CONSTRAINT "UQ_d44c8bed510197c58a67563b30b"`,
    );
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "userLogId"`);
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "entity"`);
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "property"`);
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "oldValue"`);
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "newValue"`);
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "processed"`);
    await queryRunner.query(`ALTER TABLE "event_log" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "supported_asset" RENAME COLUMN "blockchain" TO "chainName"`,
    );
  }
}
