import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
    Request,
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './user.entity'
import type { getUsersDto, addUserDto, updateUserDto } from './dto/get-users.dto'
import { Public } from '../decorators/public.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminGuard } from '../guards/admin.guard'
import { IsString } from 'class-validator'
import { Roles } from '../decorators/role.decorator'
import { Role } from '../enum/role.enum'
import { RolesGuard } from '../guards/role.guards'

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor) // 排除密码
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getUser(@Query() user: getUsersDto) {
        // return this.userService.findUsers(user)
        return this.userService.getUserBuilder(user)
    }

    @Post()
    addUser(@Body() user: addUserDto) {
        return this.userService.addUser(user)
    }

    @Patch('user-profile/:id')
    editUserProfile(@Param('id') id: number, @Body() user: Partial<User>) {
        return this.userService.updateUserAndProfile(id, user)
    }

    @Get('test')
    // @UseGuards(AdminGuard)
    getProfile(@Request() req: any) {
        return req.user
    }
    @Get(':id')
    getUserById(@Query() user: getUsersDto, @Param('id') id: number) {
        // return this.userService.findUsers(user)
        return this.userService.getUserBuilder(user, id)
    }
    @Delete(':id')
    deleteUSer(@Param('id') id: number) {
        return this.userService.deleteUser(id)
    }

    @Patch(':id')
    editUser(@Param('id') id: number, @Body() user: Partial<updateUserDto>) {
        return this.userService.updateUser(id, user)
    }

    @Put('recover/:id')
    recoverUser(@Param('id') id: number) {
        return this.userService.recover(id)
    }
}
