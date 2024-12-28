import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitProperties011734544921869 implements MigrationInterface {
  name = 'InitProperties011734544921869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "white_list_address" ("label" character varying, "description" character varying, "address" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ff7ccaf59a2b2b885f473f143f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("names" character varying NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("name" character varying NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("name" character varying NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control" ("description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "permissionId" uuid, "statusId" uuid, "roleId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_d6e740dd8176703f04c25e4cce" UNIQUE ("permissionId"), CONSTRAINT "REL_491a0846ae4bcfd4f1fae38159" UNIQUE ("statusId"), CONSTRAINT "REL_964b59badeada82e25673f22d5" UNIQUE ("roleId"), CONSTRAINT "REL_d5d61a4bb820f6d39377d4cc9c" UNIQUE ("userId"), CONSTRAINT "PK_b9de1f7fe64190ed206929a6d24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_log" ("details" character varying, "priority" character varying, "status" character varying NOT NULL, "type" character varying NOT NULL, "assetName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "walletId" uuid NOT NULL, CONSTRAINT "PK_c31d1e77795e3bd9d5f6399f988" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "nft_transaction" ("fee" integer, "transactionHash" character varying NOT NULL, "toAddress" character varying NOT NULL, "fromAddress" character varying NOT NULL, "contractAddress" character varying NOT NULL, "blockchain" character varying NOT NULL, "wallet" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nftId" uuid NOT NULL, CONSTRAINT "PK_ec99dc30788f40287971371429e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "nft" ("attributes" character varying, "OwnerAddress" character varying NOT NULL, "name" character varying NOT NULL, "objectUri" character varying NOT NULL, "metadataUri" character varying NOT NULL, "contractAddress" character varying NOT NULL, "blockchain" character varying NOT NULL, "token" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "walletId" uuid NOT NULL, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("details" character varying, "legacyAddress" character varying NOT NULL, "blockchain" character varying NOT NULL, "address" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mainWalletId" uuid NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "passphrase" ("location" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1768f39c05609bb76464bfd0f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "main_wallet" ("type" character varying, "name" character varying, "address" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "passphraseId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_c75188c2165fb64d36e04861a4" UNIQUE ("passphraseId"), CONSTRAINT "PK_a5e67b15bd3fa73bb55def484a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("scheduledAt" character varying, "sentAt" character varying, "isRead" boolean, "status" character varying, "priority" character varying, "type" character varying NOT NULL, "message" character varying NOT NULL, "title" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deviceId" uuid NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device" ("name" character varying, "physicalId" character varying, "type" character varying NOT NULL, "token" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("phone" character varying, "id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "abilitiesId" uuid, "photoId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_63f67207ad5ff88665dd264314" UNIQUE ("abilitiesId"), CONSTRAINT "REL_75e2be4ce11d447ef43be0e374" UNIQUE ("photoId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_log" ("event" character varying NOT NULL, "details" json, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40410d6bf0bedb43f9cadae6fef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transfer_transaction" ("fromAddress" character varying NOT NULL, "toAddress" character varying NOT NULL, "fee" integer NOT NULL, "amount" integer NOT NULL, "blockchain" character varying NOT NULL, "transactionHash" character varying NOT NULL, "wallet" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcd6254da86c093d217e6cf2429" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "swap_transaction" ("fee" integer NOT NULL, "dex" character varying NOT NULL, "amountOut" integer NOT NULL, "amountIn" integer NOT NULL, "toToken" character varying NOT NULL, "wallet" integer NOT NULL, "fromToken" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_78506c4050ae7cedd50b08c0dc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supported_asset" ("protocol" character varying, "nativeAsset" character varying, "issuerAddress" character varying, "type" character varying NOT NULL, "decimals" integer, "contractAddress" character varying, "blockchain" character varying NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_950dfa87ff1522d9cdce2e10181" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_transaction" ("type" character varying NOT NULL, "fee" integer NOT NULL, "paymentMethod" character varying, "totalValue" integer NOT NULL, "price" integer NOT NULL, "cryptoAmount" integer NOT NULL, "currencyAmount" integer, "wallet" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d1c3a07f8a0cb7044b57cfe5f35" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_log" ("status" character varying NOT NULL DEFAULT 'Pending', "processed" boolean NOT NULL, "newValue" character varying NOT NULL, "oldValue" character varying NOT NULL, "property" character varying NOT NULL, "entity" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userLogId" uuid NOT NULL, CONSTRAINT "REL_d44c8bed510197c58a67563b30" UNIQUE ("userLogId"), CONSTRAINT "PK_d8ccd9b5b44828ea378dd37e691" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_d5d61a4bb820f6d39377d4cc9cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" ADD CONSTRAINT "FK_2f223007f185c0edc31588b45f2" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft_transaction" ADD CONSTRAINT "FK_9530800a66872bf99bfee51454e" FOREIGN KEY ("nftId") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "FK_507e94bbcf55ced306bf3b72e70" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_0017ef91c935a7df25f051c36f7" FOREIGN KEY ("mainWalletId") REFERENCES "main_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD CONSTRAINT "FK_c75188c2165fb64d36e04861a43" FOREIGN KEY ("passphraseId") REFERENCES "passphrase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" ADD CONSTRAINT "FK_7b0f82347ae332601a540247b2b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_0f828a02012d80b83068a893672" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_63f67207ad5ff88665dd2643141" FOREIGN KEY ("abilitiesId") REFERENCES "access_control"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD CONSTRAINT "FK_85f2dd25304ee3a9e43a5c5bcae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_log" DROP CONSTRAINT "FK_85f2dd25304ee3a9e43a5c5bcae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_63f67207ad5ff88665dd2643141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_0f828a02012d80b83068a893672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" DROP CONSTRAINT "FK_7b0f82347ae332601a540247b2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "main_wallet" DROP CONSTRAINT "FK_c75188c2165fb64d36e04861a43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_0017ef91c935a7df25f051c36f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "FK_507e94bbcf55ced306bf3b72e70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft_transaction" DROP CONSTRAINT "FK_9530800a66872bf99bfee51454e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_log" DROP CONSTRAINT "FK_2f223007f185c0edc31588b45f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_d5d61a4bb820f6d39377d4cc9cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_964b59badeada82e25673f22d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_491a0846ae4bcfd4f1fae38159a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_d6e740dd8176703f04c25e4cceb"`,
    );
    await queryRunner.query(`DROP TABLE "event_log"`);
    await queryRunner.query(`DROP TABLE "order_transaction"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "supported_asset"`);
    await queryRunner.query(`DROP TABLE "swap_transaction"`);
    await queryRunner.query(`DROP TABLE "transfer_transaction"`);
    await queryRunner.query(`DROP TABLE "type"`);
    await queryRunner.query(`DROP TABLE "user_log"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "main_wallet"`);
    await queryRunner.query(`DROP TABLE "passphrase"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "nft"`);
    await queryRunner.query(`DROP TABLE "nft_transaction"`);
    await queryRunner.query(`DROP TABLE "transaction_log"`);
    await queryRunner.query(`DROP TABLE "access_control"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "white_list_address"`);
  }
}
