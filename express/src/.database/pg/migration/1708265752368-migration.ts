import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1708265752368 implements MigrationInterface {
    name = 'Migration1708265752368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" ADD "url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "url"`);
    }

}
