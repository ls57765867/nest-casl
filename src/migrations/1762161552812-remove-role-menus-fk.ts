import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRoleMenusFk1762161552812 implements MigrationInterface {
    name = 'RemoveRoleMenusFk1762161552812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_8201d8c066af91187a973ecd23d\``);
        await queryRunner.query(`ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_e514ec73ca15187d43e56511a6a\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_e514ec73ca15187d43e56511a6a\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_8201d8c066af91187a973ecd23d\` FOREIGN KEY (\`menusId\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
