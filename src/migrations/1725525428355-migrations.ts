import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725525428355 implements MigrationInterface {
    name = 'Migrations1725525428355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "theater" ADD "zip" character varying`);
        await queryRunner.query(`ALTER TABLE "theater" ADD "thumbnail" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "theater" DROP COLUMN "thumbnail"`);
        await queryRunner.query(`ALTER TABLE "theater" DROP COLUMN "zip"`);
    }

}
