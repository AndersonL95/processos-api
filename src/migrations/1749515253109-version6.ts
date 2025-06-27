import { MigrationInterface, QueryRunner } from "typeorm";

export class Version61746487468002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "add_term" (
                "id" SERIAL PRIMARY KEY,
                "tenantId" INTEGER NOT NULL,
                "contractId" INTEGER NOT NULL,
                "nameTerm" character varying NOT NULL,
                "file" character varying,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_contract_add_term" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "add_term"`);

    }

}
