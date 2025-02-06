import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725289425666 implements MigrationInterface {
    name = 'Migrations1725289425666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "theater" RENAME COLUMN "allocine_id" TO "provider_id"`);
        await queryRunner.query(`ALTER TABLE "theater" ADD CONSTRAINT "UQ_c9c891b92e6a6e2315d1c3d419d" UNIQUE ("provider_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "theater" DROP CONSTRAINT "UQ_c9c891b92e6a6e2315d1c3d419d"`);
        await queryRunner.query(`ALTER TABLE "theater" RENAME COLUMN "provider_id" TO "allocine_id"`);
    }

}
