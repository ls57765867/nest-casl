import {
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'
import { Profile } from './profile.entity'
import { Logs } from '../logs/logs.entity'
import { Role } from '../roles/role.entity'
import { Exclude } from 'class-transformer'
import { Dept } from '../dept/entities/dept.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column()
    @Exclude() // 自动排除密码字段
    password: string

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    profile: Profile

    @OneToMany(() => Logs, (log) => log.user)
    logs: Logs[]

    @ManyToMany(() => Dept, (dept) => dept.users, { createForeignKeyConstraints: false, cascade: false })
    @JoinTable({ name: 'user_depts' })
    depts: Dept[]

    @ManyToMany(() => Role, (role) => role.users, { createForeignKeyConstraints: false, cascade: false })
    @JoinTable({ name: 'user_roles' })
    roles: Role[]

    // ✅ 自动填充创建时间
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        precision: 0, // 移除毫秒精度
        default: () => 'CURRENT_TIMESTAMP',
        comment: '创建时间',
    })
    createdAt: Date

    // ✅ 自动在更新时刷新
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        precision: 0, // 移除毫秒精度
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        comment: '更新时间',
    })
    updatedAt: Date

    /** 软删除时间（执行 softRemove 时自动填充） */
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'datetime',
        precision: 0, // 移除毫秒精度
        nullable: true,
        comment: '删除时间（软删除）',
    })
    deletedAt?: Date | null
}
