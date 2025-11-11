import { Menu } from '../menus/entities/menu.entity'
import { User } from '../user/user.entity'
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    orderNumber: number

    @Column()
    status: number

    @ManyToMany(() => User, (user) => user.roles)
    users: User[]

    @ManyToMany(() => Menu, (menu) => menu.roles, { createForeignKeyConstraints: false })
    @JoinTable({
        name: 'role_menus',
    })
    menus: Menu[]
}
