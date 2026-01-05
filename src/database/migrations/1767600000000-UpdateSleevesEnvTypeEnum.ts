import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSleevesEnvTypeEnum1767600000000
  implements MigrationInterface
{
  name = 'UpdateSleevesEnvTypeEnum1767600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sleeves_env_type_enum" AS ENUM('testnet', 'mainnet')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ADD COLUMN IF NOT EXISTS "envType" character varying`,
    );
    await queryRunner.query(`
      UPDATE "sleeves"
      SET "envType" = CASE
        WHEN lower("envType") IN ('testnet', 'dev', 'development') THEN 'testnet'
        WHEN lower("envType") IN ('production', 'prod', 'mainnet') THEN 'mainnet'
        ELSE 'testnet'
      END
    `);
    await queryRunner.query(
      `ALTER TABLE "sleeves" ALTER COLUMN "envType" TYPE "public"."sleeves_env_type_enum" USING lower("envType")::"public"."sleeves_env_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ALTER COLUMN "envType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ALTER COLUMN "envType" SET DEFAULT 'testnet'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sleeves" ALTER COLUMN "envType" TYPE character varying USING "envType"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ALTER COLUMN "envType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeves" ALTER COLUMN "envType" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TYPE "public"."sleeves_env_type_enum"`);
  }
}
