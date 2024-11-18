import { MigrationInterface, QueryRunner } from "typeorm";

export class Version41731691396941 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       
     
        await queryRunner.query(`
            CREATE TABLE "user_notification" (
                "id" SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL,
                "notificationId" INTEGER NOT NULL,
                "read" BOOLEAN DEFAULT FALSE,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_user_notification_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_user_notification_notification" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_notification_userId" ON "user_notification" ("userId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_notification_notificationId" ON "user_notification" ("notificationId");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_user_notification_userId";`);
        await queryRunner.query(`DROP INDEX "IDX_user_notification_notificationId";`);
        await queryRunner.query(`DROP TABLE "user_notification";`);
    }

}
