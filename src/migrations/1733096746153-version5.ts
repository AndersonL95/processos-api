import { MigrationInterface, QueryRunner } from "typeorm";

export class Version51733096746153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "PK_notification_id" PRIMARY KEY ("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notification"
            DROP CONSTRAINT "PK_notification_id";
        `);
    }

}
