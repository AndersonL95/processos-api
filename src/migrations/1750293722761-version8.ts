import { MigrationInterface, QueryRunner } from "typeorm";

export class Version81750293722761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
           await queryRunner.query(`
            ALTER TABLE "add_term"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
           await queryRunner.query(`
            ALTER TABLE "add_term" 
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `
           )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "add_term" 
            DROP COLUMN "createdAt"
        `)
        await queryRunner.query(`
            ALTER TABLE "add_term" 
            DROP COLUMN "updatedAt"
        `)
    }

}
