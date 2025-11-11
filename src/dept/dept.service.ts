import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateDeptDto, GetDeptDto, UpdateDeptDto } from './dto/index.dto'
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm'
import { Dept } from './entities/dept.entity'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { conditionUtils } from '@/utils/db.helper'
import { buildTreeWithMap } from '@/utils/tools'
import { Transactional } from 'typeorm-transactional'

@Injectable()
export class DeptService {
    constructor(
        @InjectRepository(Dept) private readonly deptRepository: Repository<Dept>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) {}
    create(createDeptDto: CreateDeptDto & { createBy: string }) {
        return this.deptRepository.save(createDeptDto)
    }

    async findAll(getDeptDto: GetDeptDto) {
        const queryBuilder = this.deptRepository.createQueryBuilder('dept')
        const { deptName } = getDeptDto

        let obj = {
            'dept.deptName': deptName,
        }

        const depts = await conditionUtils(queryBuilder, obj).getMany()
        return buildTreeWithMap(depts)
    }

    findOne(id: number) {
        return `This action returns a #${id} dept`
    }

    async update(id: number, updateDeptDto: UpdateDeptDto) {
        const deptToUpdate = await this.deptRepository.preload({
            id,
            ...updateDeptDto,
        })
        if (!deptToUpdate) {
            throw new NotFoundException(`ID为 ${id} 的部门不存在`)
        }
        return await this.deptRepository.save(deptToUpdate)
    }
    // async softRemoveWithChildren(id: number): Promise<void> {
    //     const queryRunner = this.dataSource.createQueryRunner()

    //     await queryRunner.connect()
    //     await queryRunner.startTransaction()

    //     try {
    //         // 1. 查找所有子部门
    //         const children = await this.findChildrenRecursive(id, queryRunner)
    //         const allIds = [id, ...children.map((c) => c.id)]

    //         // 2. 批量软删除
    //         await queryRunner.manager.getRepository(Dept).softDelete(allIds)

    //         await queryRunner.commitTransaction()
    //     } catch (error) {
    //         await queryRunner.rollbackTransaction()
    //         throw error
    //     } finally {
    //         await queryRunner.release()
    //     }
    // }

    // // 递归查找子部门
    // private async findChildrenRecursive(parentId: number, queryRunner: QueryRunner): Promise<Dept[]> {
    //     const children = await queryRunner.manager.getRepository(Dept).find({
    //         // 使用事务内的repository
    //         where: { parentId },
    //     })

    //     let allChildren: Dept[] = [...children]

    //     for (const child of children) {
    //         const grandChildren = await this.findChildrenRecursive(child.id, queryRunner)
    //         allChildren = [...allChildren, ...grandChildren]
    //     }

    //     return allChildren
    // }

    // async softRemoveWithChildren(id: number): Promise<void> {
    //     await this.dataSource.transaction(async (manager) => {
    //         // 1. 查找所有子部门
    //         const children = await this.findChildrenRecursive(id, manager)
    //         const allIds = [id, ...children.map((c) => c.id)]

    //         // 2. 批量软删除（事务内）
    //         await manager.getRepository(Dept).softDelete(allIds)
    //     })
    // }

    @Transactional()
    async softRemoveWithChildren(id: number): Promise<void> {
        const children = await this.findChildrenRecursive(id)
        const allIds = [id, ...children.map((c) => c.id)]
        await this.deptRepository.softDelete(allIds)
    }

    async findChildrenRecursive(parentId: number): Promise<Dept[]> {
        const children = await this.deptRepository.find({ where: { parentId } })
        let allChildren = [...children]

        for (const child of children) {
            const grandChildren = await this.findChildrenRecursive(child.id)
            allChildren = [...allChildren, ...grandChildren]
        }

        return allChildren
    }

    // async remove(id: number) {
    //     const result = await this.deptRepository.softDelete(id)

    //     if (result.affected === 0) {
    //         throw new NotFoundException(`部门 ${id} 不存在`)
    //     }
    // }

    // 恢复单个部门
    async restore(id: number): Promise<Dept | null> {
        const result = await this.deptRepository.restore(id)

        if (result.affected === 0) {
            throw new NotFoundException(`部门 ${id} 不存在或未被删除`)
        }

        return this.deptRepository.findOneBy({ id })
    }
}
