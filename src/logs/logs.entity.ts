import { User } from '../user/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Logs {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    path: string

    @Column()
    method: string

    @Column()
    data: string

    @Column()
    result: number

    @ManyToOne(() => User, (user) => user.logs, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'user_id' }) // 外键字段放这里
    user: User
}
