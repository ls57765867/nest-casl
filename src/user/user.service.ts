import { ClassSerializerInterceptor, HttpException, Injectable, UseInterceptors } from '@nestjs/common'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Equal, Repository } from 'typeorm'
import { Logs } from '../logs/logs.entity'
import { addUserDto, getUsersDto, updateUserDto } from './dto/get-users.dto'
import { conditionUtils } from '@/utils/db.helper'
import * as argon2 from 'argon2'

type DeleteResult = {
    raw?: Record<string, any>
    affected?: number
}
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    ) {}
    async findUsers(user: getUsersDto) {
        const { page = 1, limit, username, gender, role } = user
        const take = limit || 10
        const skip = (page - 1) * take
        return this.userRepository.find({
            select: {
                id: true,
                username: true,
                password: false,
                roles: {
                    id: true,
                    name: true,
                },
                profile: {
                    gender: true,
                },
            },
            relations: {
                roles: true,
                profile: true,
            },
            where: {
                username,
                profile: {
                    gender,
                },
                roles: {
                    id: role,
                },
            },
            take,
            skip,
        })
    }

    async getUserBuilder(user: getUsersDto, id?: number) {
        const { page = 1, limit = 10, username, gender, role } = user
        const skip = (page - 1) * limit
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('user.profile', 'profile')
        // .select(['user.id', 'user.username', 'roles.name', 'profile'])
        if (id) {
            queryBuilder.where('user.id = :id', { id })
        }

        let obj = {
            'user.username': username,
            'profile.gender': gender,
            'roles.id': role,
        }

        return conditionUtils(queryBuilder, obj).limit(limit).offset(skip).getMany()
    }

    async findUser(username: string, password: string) {
        const user = this.userRepository.findOne({
            where: {
                username,
                password,
            },
        })
        if (user) return user
        return false
    }

    async findUserByUsername(username: string) {
        const user = this.userRepository.findOne({
            where: {
                username,
            },
        })
        if (user) return user
        return false
    }

    async findUserRoles(id: number) {
        const user = await this.userRepository.find({
            select: {
                password: false,
                roles: true,
            },
            where: {
                id,
            },
            relations: ['roles'],
        })
        if (user) return user[0].roles
        throw new HttpException(`用户不存在`, 500)
    }

    async addUser(user: addUserDto) {
        const password = await argon2.hash(user.password)
        const { id } = await this.userRepository.save({
            username: user.username,
            password,
        })
        return await this.userRepository.findOneBy({ id })
    }

    async updateUser(id: number, user: Partial<updateUserDto>) {
        await this.userRepository.update(id, user)
        const res = await this.userRepository.find({
            select: {
                username: true,
                password: false,
            },
            where: {
                id: 3,
            },
        })
        return res
    }

    async updateUserAndProfile(id: number, userDto: Partial<User>) {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] })
        if (!user) {
            throw new HttpException(`用户 ${id} 不存在`, 500)
        }
        const newUser = this.userRepository.merge(user, userDto)
        await this.userRepository.save(newUser)
        return await this.userRepository.findOneBy({ id })
    }

    async deleteUser(id: number) {
        const result = (await this.userRepository.softDelete(id)) as DeleteResult
        if (result.affected === 0) {
            throw new HttpException(`用户 ${id} 不存在或已被删除`, 500)
        }
        return '删除用户成功'
    }

    async recover(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
            withDeleted: true,
        })
        if (!user) {
            return '用户不存在'
        }
        return await this.userRepository.recover(user)
    }
}
