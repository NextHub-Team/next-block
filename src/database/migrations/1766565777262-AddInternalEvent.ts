import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInternalEvent1766565777262 implements MigrationInterface {
  name = 'AddInternalEvent1766565777262';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."account_kyc_status_enum" AS ENUM('pending', 'verified', 'rejected', 'expired')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum" AS ENUM('active', 'deactivate')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_provider_name_enum" AS ENUM('fireblocks', 'interlace', 'striga')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("KycStatus" "public"."account_kyc_status_enum" NOT NULL DEFAULT 'pending', "label" character varying, "metadata" jsonb, "status" "public"."account_status_enum" NOT NULL DEFAULT 'active', "providerAccountId" character varying NOT NULL, "providerName" "public"."account_provider_name_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "internal_event" ("payload" jsonb NOT NULL DEFAULT '{}'::jsonb, "eventType" character varying NOT NULL, "publishedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c2e73e0b218f2b87dc27cc33b33" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" ADD CONSTRAINT "FK_c608d58fd324be5d7743a431396" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fireblocks_cw_wallet" DROP CONSTRAINT "FK_c608d58fd324be5d7743a431396"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(`DROP TABLE "internal_event"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TYPE "public"."account_provider_name_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_kyc_status_enum"`);
  }
}
