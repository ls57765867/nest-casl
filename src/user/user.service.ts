import { Injectable, Logger } from '@nestjs/common'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Equal, Repository } from 'typeorm'
import { Logs } from 'src/logs/logs.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    ) {}

    async findAll() {
        return await this.userRepository.find()
    }

    async find(username: string) {
        return this.userRepository.findOneBy({ username })
    }
    async getUserById(id: number) {
        return this.userRepository.findOneBy({ id })
    }

    async create(user: User) {
        const userTemp = await this.userRepository.create(user)
        return this.userRepository.save(userTemp)
    }

    async update(id: number, user: Partial<User>) {
        return this.userRepository.update(id, user)
    }

    async remove(id: number) {
        return this.userRepository.delete({})
    }

    async getProfile(id: number) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['profile'],
        })
    }

    async getLogs(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
        })

        return this.logsRepository.find({
            where: {
                user: Equal(user!.id),
            },
            // relations: ['user'],
        })
    }
}
