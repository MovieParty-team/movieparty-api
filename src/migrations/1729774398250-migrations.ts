import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1729774398250 implements MigrationInterface {
    name = 'Migrations1729774398250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "provider_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_babdc0524b6f27914ff767f09cb" UNIQUE ("provider_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_babdc0524b6f27914ff767f09cb"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "provider_id"`);
    }

}
