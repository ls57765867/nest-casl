import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserContextService } from '../common/cls/user-context.service'

// 审计拦截器 收集user信息
@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private readonly userContext: UserContextService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const user = request.user?.username ?? '未登录用户'
        this.userContext.setUser(user)
        return next.handle()
    }
}
