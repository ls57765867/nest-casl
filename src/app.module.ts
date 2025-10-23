import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { Logger } from 'nestjs-pino'
import { join } from 'path'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { DatabaseModule } from './database/database.module'
import { AppLoggerModule } from './logger/logger.module'
import { EnvConfigModule } from './config/config.module'

@Module({
    imports: [
        // ConfigModule.forRoot({
        //     load: [ConfigLoader.load(process.env.NODE_ENV ?? 'development')],
        //     isGlobal: true,
        // }),
        EnvConfigModule, // ✅ 环境变量
        DatabaseModule, // ✅ 数据库模块
        AppLoggerModule, // ✅ 日志模块
        UserModule, // ✅ 用户模块
    ],
    controllers: [AppController],
    providers: [
        AppService,
        Logger,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
