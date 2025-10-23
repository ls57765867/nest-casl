import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Profile } from './profile.entity'
import { Roles } from 'src/roles/roles.entity'
import { Logs } from 'src/logs/logs.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, Roles, Logs])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
