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
                return {
                    type: 'mysql',
                    host: db.host,
                    port: db.port,
                    username: db.username,
                    password: db.password,
                    database: db.database,
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    synchronize: process.env.NODE_ENV !== 'production',
                    autoLoadEntities: true,
                    logging: process.env.NODE_ENV === 'development',
                }
            },
        }),
    ],
})
export class DatabaseModule {}
