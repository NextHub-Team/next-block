import { MigrationInterface, QueryRunner } from 'typeorm';

export class Account1766125249679 implements MigrationInterface {
  name = 'Account1766125249679';

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
      `CREATE TABLE "account" ("KycStatus" "public"."account_kyc_status_enum" NOT NULL DEFAULT 'pending', "lastSyncedAt" TIMESTAMP NOT NULL DEFAULT now(), "label" character varying, "metadata" jsonb, "status" "public"."account_status_enum" NOT NULL DEFAULT 'active', "providerAccountId" character varying NOT NULL, "providerName" "public"."account_provider_name_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ALTER COLUMN "active" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ALTER COLUMN "active" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ALTER COLUMN "active" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ALTER COLUMN "active" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TYPE "public"."account_provider_name_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_kyc_status_enum"`);
  }
}
