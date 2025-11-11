import { User } from '@/src/user/user.entity'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Dept {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    deptName: string

    @Column()
    deptCode: string

    @Column({ nullable: true })
    parentId: number

    @Column('float')
    orderNumber: number

    @Column()
    createBy: string

    @Column()
    status: number

    @ManyToMany(() => User, (user) => user.depts)
    users: User[]

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
