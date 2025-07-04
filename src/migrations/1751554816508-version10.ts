import { MigrationInterface, QueryRunner } from "typeorm";

export class Version101751554816508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`
            ALTER TABLE "add_term"
            ADD "newTermDate" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "add_term" 
            DROP COLUMN "newTermDate"
        `)
    }

}
