import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessTable1720299665155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "cpf" character varying, "phone" character varying, "cargo" character varying, "refreshToken" character varying, CONSTRAINT "pk_users" PRIMARY KEY(id))`);
        await queryRunner.query(`CREATE TABLE "contract" ("id" SERIAL PRIMARY KEY, "name" character varying NOT NULL, "numProcess" character varying NOT NULL, "numContract" character varying NOT NULL, "manager" character varying NOT NULL, "supervisor" character varying NOT NULL, "initDate" TIMESTAMP NOT NULL, "finalDate" TIMESTAMP NOT NULL, "contractLaw" character varying NOT NULL, "contractStatus" character varying NOT NULL, "balance" character varying NOT NULL, "todo" character varying NOT NULL, "addTerm" character varying NOT NULL, "addQuant" character varying NOT NULL, "companySituation" character varying NOT NULL, "userId" integer,"file" character varying NOT NULL, CONSTRAINT "pk_contract" FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE CASCADE)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "contract"`);
    }


}
