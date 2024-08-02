import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722258813030 implements MigrationInterface {
    name = 'Migrations1722258813030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "userId" integer, "followerId" integer, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "poster" character varying NOT NULL, "synopsis" character varying NOT NULL, "genre" character varying NOT NULL, "casting" character varying NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_theater" ("id" SERIAL NOT NULL, "userId" integer, "theaterId" integer, CONSTRAINT "PK_4d9da640ef49d04556a107877a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "theater" ("id" SERIAL NOT NULL, "allocine_id" character varying NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_c70874202894cfb1575a5b2b743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "session_date" TIMESTAMP NOT NULL, "movieId" integer, "theaterId" integer, "userId" integer, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group" ("id" SERIAL NOT NULL, "userId" integer, "groupId" integer, CONSTRAINT "PK_3c29fba6fe013ec8724378ce7c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL, "is_admin" boolean NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "bio" character varying NOT NULL, "avatar" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_movie" ("id" SERIAL NOT NULL, "userId" integer, "movieId" integer, CONSTRAINT "PK_2fe260b71a39352cfebb47ffa4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_theater" ADD CONSTRAINT "FK_c0264cf0160086a369910429b50" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_theater" ADD CONSTRAINT "FK_75fbabd952498276945da7e7c89" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_0d0aea3f43143fa3ac21f70eb49" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_fd0354de025d345b24f3f164498" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d6b372788ab01be58853003c93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_movie" ADD CONSTRAINT "FK_13836cd6ae56580075e1bd33967" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_movie" ADD CONSTRAINT "FK_3e731d371b40a498f72b3e57d9d" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_movie" DROP CONSTRAINT "FK_3e731d371b40a498f72b3e57d9d"`);
        await queryRunner.query(`ALTER TABLE "user_movie" DROP CONSTRAINT "FK_13836cd6ae56580075e1bd33967"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_fd0354de025d345b24f3f164498"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_0d0aea3f43143fa3ac21f70eb49"`);
        await queryRunner.query(`ALTER TABLE "user_theater" DROP CONSTRAINT "FK_75fbabd952498276945da7e7c89"`);
        await queryRunner.query(`ALTER TABLE "user_theater" DROP CONSTRAINT "FK_c0264cf0160086a369910429b50"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2"`);
        await queryRunner.query(`DROP TABLE "user_movie"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "theater"`);
        await queryRunner.query(`DROP TABLE "user_theater"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
