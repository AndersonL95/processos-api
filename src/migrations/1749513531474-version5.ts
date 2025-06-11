import { MigrationInterface, QueryRunner } from "typeorm";

export class Version51749513531474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "contract" 
            DROP COLUMN "addTerm"
        `
            
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`
            ALTER TABLE "contract" 
            DROP COLUMN "addTerm"
        `
         )
    }

}
