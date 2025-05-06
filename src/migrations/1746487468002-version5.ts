import { MigrationInterface, QueryRunner } from "typeorm";

export class Version51746487468002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "addTerm" (
                "id" SERIAL PRIMARY KEY,
                "tenantId" INTEGER NOT NULL,
                "contractId" INTEGER NOT NULL,
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_contract_addTerms" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "addTerm"`);

    }

}
