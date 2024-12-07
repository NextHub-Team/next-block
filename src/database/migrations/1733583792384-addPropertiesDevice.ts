import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropertiesDevice1733583792384 implements MigrationInterface {
  name = 'AddPropertiesDevice1733583792384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "physicalId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "token" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "token"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "physicalId"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "name"`);
  }
}
