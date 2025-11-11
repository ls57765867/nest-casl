import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    BaseEntity as TypeOrmBaseEntity,
} from 'typeorm'

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键ID' })
    id: number

    /** 创建人 */
    @Column({ name: 'created_by', type: 'varchar', length: 50, nullable: true, comment: '创建人' })
    createdBy?: string

    /** 创建时间（自动填充） */
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        comment: '创建时间',
    })
    createdAt: Date

    /** 更新人 */
    @Column({ name: 'updated_by', type: 'varchar', length: 50, nullable: true, comment: '更新人' })
    updatedBy?: string

    /** 更新时间（自动填充） */
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        comment: '更新时间',
    })
    updatedAt: Date

    /** 软删除时间（执行 softRemove 时自动填充） */
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        precision: 0,
        nullable: true,
        comment: '删除时间（软删除）',
    })
    deletedAt?: Date | null
}
