import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { UserContextService } from './user-context.service'

@Module({
    imports: [
        ClsModule.forRoot({
            global: true, // 让 CLS 全局可用
            // middleware: { mount: true }, // 自动为所有请求挂载 CLS
            middleware: {
                mount: true,
                setup: (cls, req) => {
                    const user = req.user // 从JWT等获取用户信息
                    cls.set('cls-user', user)
                },
            },
        }),
    ],
    providers: [UserContextService],
    exports: [UserContextService],
})
export class AppClsModule {}
