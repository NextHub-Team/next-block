import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransaction1767381442733 implements MigrationInterface {
  name = 'AddTransaction1767381442733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sleeves" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2a7ea970d770fa5932b515bc845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sleeves_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d28b573649ff4afcd3c24bad411" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "providerAccountId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "customerRefId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "accountId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_event" ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."account_status_enum" RENAME TO "account_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum" AS ENUM('active', 'deactivate')`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" TYPE "public"."account_status_enum" USING "status"::"text"::"public"."account_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."account_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum_old" AS ENUM('active', 'deactivate')`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" TYPE "public"."account_status_enum_old" USING "status"::"text"::"public"."account_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."account_status_enum_old" RENAME TO "account_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_event" ALTER COLUMN "payload" SET DEFAULT '{}'`,
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountId"`);
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "customerRefId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "providerAccountId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "account" ADD "metadata" jsonb`);
    await queryRunner.query(`DROP TABLE "sleeves_transaction"`);
    await queryRunner.query(`DROP TABLE "sleeves"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
