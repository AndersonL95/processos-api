import { MigrationInterface, QueryRunner } from "typeorm";

export class Version31731458616515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL PRIMARY KEY,"tenantId" INTEGER,"contractId" INTEGER, "message" character varying NOT NULL, "read" BOOLEAN DEFAULT FALSE, "createdAt" TIMESTAMP DEFAULT NOW() )`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
