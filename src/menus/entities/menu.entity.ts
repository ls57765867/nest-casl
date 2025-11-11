import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'
import { Role } from '../../roles/role.entity'

@Entity('menus')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true }) //父级id
    parentId: number

    @Column()
    name: string // 菜单名或按钮名

    @Column({ nullable: true })
    icon: string // 菜单名或按钮名

    @Column({ nullable: true })
    path?: string // 路由路径，菜单项用

    @Column({ nullable: true })
    query?: string // 路由参数

    @Column({ nullable: true })
    componentPath?: string // 组件路径

    @Column()
    status: number // 是否启用 0 启用 1不启用

    @Column()
    menuType: number // 菜单类型 0 目录 1 菜单 2 按钮

    @Column()
    createBy: string // 组件路径

    @Column()
    orderNumber: number // 菜单名或按钮名

    @Column({ nullable: true })
    permissions?: string // 权限码

    @ManyToMany(() => Role, (role) => role.menus)
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
