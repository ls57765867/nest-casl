import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'
import { User } from './user.entity'

// profile.entity.ts
@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    gender: number

    @Column()
    phone: string

    @Column()
    address: string

    @OneToOne(() => User, (user) => user.profile, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'user_id' }) // 指定外键列名
    user: User
}
