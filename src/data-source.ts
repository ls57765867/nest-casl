import { DataSource } from 'typeorm'
import { join } from 'path'
import { ConfigLoader } from './config/config.module' // ✅ 直接复用
import { User } from './user/user.entity'
import { Profile } from './user/profile.entity'
import { Roles } from './roles/roles.entity'
import { Logs } from './logs/logs.entity'

// ✅ 1. 读取配置
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const config = ConfigLoader.load<any>(NODE_ENV)() // 调用返回配置对象
const db = config.db // 你 YAML 里定义的数据库配置字段

// ✅ 2. 创建 DataSource 实例
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    entities: [User, Profile, Roles, Logs],
    migrations: [join(__dirname, '/migrations/*.{ts,js}')],
    subscribers: [],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
})
