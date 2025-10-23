import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { Profile } from './profile.entity'
import { Logs } from '../logs/logs.entity'
import { Roles } from '../roles/roles.entity'
@Entity() // 确保有括号
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile

    @OneToMany(() => Logs, (log) => log.user)
    logs: Logs[]

    @ManyToMany(() => Roles, (roles) => roles.users, { createForeignKeyConstraints: false })
    @JoinTable({ name: 'users_roles' })
    roles: Roles[]
}
