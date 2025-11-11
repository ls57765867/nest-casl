// 虽然这有效，但将策略名称直接传递给 AuthGuard() 会在代码库中引入魔术字符串。相反，我们建议创建你自己的类，如下所示：
/**
  “魔术字符串（magic string）” 是什么？
  “魔术字符串”指的是直接在代码里写死的字符串，比如 'local'、'jwt'、'google' 之类的标识。
  这样做的问题是：

  拼写容易出错；

  如果策略名改了，要到处找这些字符串；

  可读性和可维护性差。
 */
import { Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const { username, password } = request.body

        // ✅ 自定义前置校验
        if (!username || !password) {
            throw new BadRequestException('必须传入 username 和 password')
        }

        // ✅ 调用原有 passport-local 验证逻辑
        const result = (await super.canActivate(context)) as boolean
        return result
    }
}
