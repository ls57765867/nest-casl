import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserService } from '../user/user.service'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly UserService: UserService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        // @todo 根据用户权限返回true 或 false
        const user = await this.UserService.findUsers({ username: req.user.username, page: 1 })
        if (!user) return false
        return user[0].roles.findIndex((item) => item.id === 4) > -1
    }
}
