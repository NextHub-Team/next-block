import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelAccessControl1734292273501 implements MigrationInterface {
  name = 'UpdateRelAccessControl1734292273501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD "permissionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "UQ_d6e740dd8176703f04c25e4cceb" UNIQUE ("permissionId")`,
    );
    await queryRunner.query(`ALTER TABLE "access_control" ADD "statusId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "UQ_491a0846ae4bcfd4f1fae38159a" UNIQUE ("statusId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD "roleId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "UQ_964b59badeada82e25673f22d5a" UNIQUE ("roleId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" DROP CONSTRAINT "PK_e12743a7086ec826733f54e1d95"`,
    );
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "status" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ADD CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_d6e740dd8176703f04c25e4cceb" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_491a0846ae4bcfd4f1fae38159a" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_964b59badeada82e25673f22d5a" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_964b59badeada82e25673f22d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_491a0846ae4bcfd4f1fae38159a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_d6e740dd8176703f04c25e4cceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" DROP CONSTRAINT "PK_e12743a7086ec826733f54e1d95"`,
    );
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "status" ADD "id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "status" ADD CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "UQ_964b59badeada82e25673f22d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP COLUMN "roleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "UQ_491a0846ae4bcfd4f1fae38159a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP COLUMN "statusId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "UQ_d6e740dd8176703f04c25e4cceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP COLUMN "permissionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "permission" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ADD "name" character varying NOT NULL`,
    );
  }
}
