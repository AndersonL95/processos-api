import { MigrationInterface, QueryRunner } from "typeorm";

export class Version91751035645981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "password_reset" (
                "id" SERIAL PRIMARY KEY,
                "tenantId" INTEGER NOT NULL,
                "token" VARCHAR NOT NULL,
                "userId" INTEGER,
                "expiresAt" TIMESTAMP NOT NULL,
                "used" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "password_reset"`);

    }


}
