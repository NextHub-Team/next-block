import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccessControl1734283239650 implements MigrationInterface {
  name = 'AddAccessControl1734283239650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "UQ_d5d61a4bb820f6d39377d4cc9cc" UNIQUE ("userId")`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "abilitiesId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_63f67207ad5ff88665dd2643141" UNIQUE ("abilitiesId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_d5d61a4bb820f6d39377d4cc9cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_63f67207ad5ff88665dd2643141" FOREIGN KEY ("abilitiesId") REFERENCES "access_control"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_63f67207ad5ff88665dd2643141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_d5d61a4bb820f6d39377d4cc9cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_63f67207ad5ff88665dd2643141"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "abilitiesId"`);
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "UQ_d5d61a4bb820f6d39377d4cc9cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP COLUMN "userId"`,
    );
  }
}
