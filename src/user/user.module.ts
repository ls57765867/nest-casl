import { forwardRef, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { Profile } from 'src/user/profile.entity'
import { Logs } from 'src/logs/logs.entity'
import { AuthModule } from '../auth/auth.module'
import { Role } from '@/src/role/entities/role.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, Role, Logs]), forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
