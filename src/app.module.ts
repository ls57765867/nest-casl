import { Module, OnApplicationBootstrap, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { MenusModule } from './menus/menus.module'

import { Logger } from 'nestjs-pino'
import { APP_FILTER, APP_GUARD, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { DatabaseModule } from './database/database.module'
import { AppLoggerModule } from './logger/logger.module'
import { EnvConfigModule } from './config/config.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { TransformInterceptor } from './interceptors/transform.interceptor'
import { DeptModule } from './dept/dept.module'

import { addTransactionalDataSource } from 'typeorm-transactional'
import { DataSource } from 'typeorm'

@Module({
    imports: [
        EnvConfigModule, // ✅ 环境变量
        DatabaseModule, // ✅ 数据库模块
        AppLoggerModule, // ✅ 日志模块
        UserModule, // ✅ 用户模块
        MenusModule, // ✅ 菜单模块
        DeptModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        Logger,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter, // ✅ 全局异常过滤器
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor, // ✅ 全局拦截器
        },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                transform: true, // ✅ 自动将参数转为指定类型
                whitelist: true, // ✅ 移除多余的属性
                // forbidNonWhitelisted: true, // ✅ 禁止多余的属性
                // forbidUnknownValues: true, // ✅ 禁止未知的属性
            }),
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule implements OnApplicationBootstrap {
    constructor(private readonly dataSource: DataSource) {}

    onApplicationBootstrap() {
        addTransactionalDataSource(this.dataSource)
    }
}
