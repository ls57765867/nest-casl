import { MigrationInterface, QueryRunner } from "typeorm";

export class Menus1762160750757 implements MigrationInterface {
    name = 'Menus1762160750757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`acl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_menu\` (\`menusId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_8201d8c066af91187a973ecd23\` (\`menusId\`), INDEX \`IDX_e514ec73ca15187d43e56511a6\` (\`rolesId\`), PRIMARY KEY (\`menusId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_8201d8c066af91187a973ecd23d\` FOREIGN KEY (\`menusId\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_e514ec73ca15187d43e56511a6a\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_e514ec73ca15187d43e56511a6a\``);
        await queryRunner.query(`ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_8201d8c066af91187a973ecd23d\``);
        await queryRunner.query(`DROP INDEX \`IDX_e514ec73ca15187d43e56511a6\` ON \`role_menu\``);
        await queryRunner.query(`DROP INDEX \`IDX_8201d8c066af91187a973ecd23\` ON \`role_menu\``);
        await queryRunner.query(`DROP TABLE \`role_menu\``);
        await queryRunner.query(`DROP TABLE \`menus\``);
    }

}
