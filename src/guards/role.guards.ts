import { Injectable, CanActivate, ExecutionContext, HttpException, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/role.decorator'
import { Role } from '../enum/role.enum'
import { UserService } from '../user/user.service'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
        if (!requiredRoles) {
            return true
        }
        const { user } = context.switchToHttp().getRequest()
        const { userid } = user
        const roles = await this.userService.findUserRoles(userid)
        if (requiredRoles.some((role) => roles?.map((item) => item.id).includes(role))) {
            return true
        }

        throw new ForbiddenException(`用户权限不足`)
    }
}
