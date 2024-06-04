import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessTable1717459568437 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "cpf" character, "phone" character, "cargo" character, CONSTRAINT "pk_users" PRIMARY KEY(id))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }


}
