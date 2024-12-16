import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWhitelistNotification1734331809733
  implements MigrationInterface
{
  name = 'AddWhitelistNotification1734331809733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("scheduledAt" character varying, "sentAt" character varying, "isRead" boolean, "status" character varying, "priority" character varying, "type" character varying NOT NULL, "message" character varying NOT NULL, "title" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deviceId" uuid NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "white_list_address" ("label" character varying, "description" character varying, "address" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ff7ccaf59a2b2b885f473f143f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_0f828a02012d80b83068a893672" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_0f828a02012d80b83068a893672"`,
    );
    await queryRunner.query(`DROP TABLE "white_list_address"`);
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}
