import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722262930839 implements MigrationInterface {
    name = 'Migrations1722262930839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_theater" DROP CONSTRAINT "FK_c0264cf0160086a369910429b50"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`);
        await queryRunner.query(`ALTER TABLE "user_movie" DROP CONSTRAINT "FK_13836cd6ae56580075e1bd33967"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"`);
        await queryRunner.query(`ALTER TABLE "user_theater" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user_movie" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "followerUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91" PRIMARY KEY ("id", "uuid")`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user_theater" ADD CONSTRAINT "FK_4beacb45592874ae2caaf21efdc" FOREIGN KEY ("userId", "userUuid") REFERENCES "user"("id","uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_05d5b2c7d361597159edd55b676" FOREIGN KEY ("userId", "userUuid") REFERENCES "user"("id","uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_movie" ADD CONSTRAINT "FK_60e1a3c249d8d09df9e3affec8f" FOREIGN KEY ("userId", "userUuid") REFERENCES "user"("id","uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_8ea4c46116cd1d826017470f63b" FOREIGN KEY ("userId", "userUuid") REFERENCES "user"("id","uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_d2ee018e031d7d817517d9cc381" FOREIGN KEY ("followerId", "followerUuid") REFERENCES "user"("id","uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_e85d130ccaf292592a95c4ff497" FOREIGN KEY ("userId", "userUuid") REFERENCES "user"("id","uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_e85d130ccaf292592a95c4ff497"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_d2ee018e031d7d817517d9cc381"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_8ea4c46116cd1d826017470f63b"`);
        await queryRunner.query(`ALTER TABLE "user_movie" DROP CONSTRAINT "FK_60e1a3c249d8d09df9e3affec8f"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_05d5b2c7d361597159edd55b676"`);
        await queryRunner.query(`ALTER TABLE "user_theater" DROP CONSTRAINT "FK_4beacb45592874ae2caaf21efdc"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "followerUuid"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "user_movie" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "user_theater" DROP COLUMN "userUuid"`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d6b372788ab01be58853003c93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_movie" ADD CONSTRAINT "FK_13836cd6ae56580075e1bd33967" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_theater" ADD CONSTRAINT "FK_c0264cf0160086a369910429b50" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
