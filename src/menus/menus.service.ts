import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMenuDto, GetMenuDto, UpdateMenuDto } from './dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { Menu } from './entities/menu.entity'
import { DataSource, Repository } from 'typeorm'
import { conditionUtils } from '@/utils/db.helper'
import { buildTreeWithMap } from '@/utils/tools'
import { Transactional } from 'typeorm-transactional'

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) {}
    create(createMenuDto: CreateMenuDto & { createBy: string }) {
        return this.menuRepository.save(createMenuDto)
    }

    async findAll(getMenuDto: GetMenuDto) {
        const queryBuilder = this.menuRepository.createQueryBuilder('menu')
        const { name, parentId, status } = getMenuDto
        if (name) queryBuilder.andWhere('menu.name like :name', { name: `%${name}%` })

        let obj = {
            // 'menu.name': name,
            'menu.parentId': parentId,
            'menu.status': status,
        }

        const menus = await conditionUtils(queryBuilder, obj).getMany()
        return buildTreeWithMap(menus)
    }

    findOne(id: number) {
        return `This action returns a #${id} menu`
    }

    async update(id: number, updateMenuDto: UpdateMenuDto) {
        const menuToUpdate = await this.menuRepository.preload({
            id,
            ...updateMenuDto,
        })
        if (!menuToUpdate) {
            throw new NotFoundException(`ID为 ${id} 的部门不存在`)
        }
        return await this.menuRepository.save(menuToUpdate)
    }

    @Transactional()
    async softRemoveWithChildren(id: number) {
        const children = await this.findChildrenRecursive(id)
        const childrenIds = [id, ...children.map((c) => c.id)]
        this.menuRepository.softDelete(childrenIds)
        return childrenIds
    }

    async findChildrenRecursive(parentId: number) {
        const children = await this.menuRepository.find({ where: { parentId } })
        let allChildren = [...children]
        for (let child of allChildren) {
            const children = await this.findChildrenRecursive(child.id)
            allChildren = [...allChildren, ...children]
        }
        return allChildren
    }
}
