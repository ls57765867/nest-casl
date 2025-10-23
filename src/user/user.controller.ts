import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './user.entity'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('all')
    getAllUsers() {
        return this.userService.findAll()
    }

    // @Get(':id')
    // getUserById(id: number) {
    //     return this.userService.getUserById(id)
    // }

    @Post('addUser')
    addUser(@Body() user: User) {
        return this.userService.create(user)
    }

    @Get('getProfile')
    getProfile() {
        return this.userService.getProfile(1)
    }

    @Get('getLogs')
    getLogs() {
        return this.userService.getLogs(1)
    }
}
