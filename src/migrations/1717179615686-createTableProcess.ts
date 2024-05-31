import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableProcess1717179615686 implements MigrationInterface {
    name = 'CreateTableProcess1717179615686';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "cargo" character, "phone" character, CONSTRAINT "PK_Users" PRIMARY KEY ("id"));
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
