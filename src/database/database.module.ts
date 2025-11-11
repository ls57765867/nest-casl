import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const db = configService.get('db')
                const isDev = process.env.NODE_ENV === 'development'
                return {
                    type: 'mysql',
                    host: db.host,
                    port: db.port,
                    username: db.username,
                    password: db.password,
                    database: db.database,
                    entities: [__dirname + '../../**/*.entity{.ts,.js}'],
                    synchronize: isDev,
                    autoLoadEntities: true,
                    logging: isDev,
                }
            },
        }),
    ],
})
export class DatabaseModule {}
