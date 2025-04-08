import { MigrationInterface, QueryRunner } from "typeorm";

export class Version21731334580155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sector" ("id" SERIAL PRIMARY KEY,"tenantId" INTEGER, "name" character varying NOT NULL)`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sector"`);
    }

}
