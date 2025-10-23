import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { readFileSync, existsSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'
import { mergeWith, isPlainObject } from 'lodash'

export class ConfigLoader {
    static load<T>(env: string): () => T {
        // 1. 加载基础配置
        const baseConfig = this.loadYamlConfig('config.yaml')

        // 2. 加载环境配置（支持.env和.local覆盖）
        const envConfig = this.loadEnvConfig(env)

        // 3. 深度合并（保留原始对象结构）
        const mergedConfig = this.deepMergeConfigs(baseConfig, envConfig)

        return () => mergedConfig as T
    }

    private static loadYamlConfig(fileName: string): object {
        const filePath = join(__dirname, '../../config', fileName)
        if (!existsSync(filePath)) return {}
        return (yaml.load(readFileSync(filePath, 'utf8')) as object) || {}
    }

    private static loadEnvConfig(env: string): object {
        // 加载顺序：env.yaml -> env.local.yaml
        const configs = [
            this.loadYamlConfig(`config.${env}.yaml`),
            this.loadYamlConfig(`config.${env}.local.yaml`), // 本地覆盖文件（应加入.gitignore）
        ]

        // 支持环境变量注入（优先级最高）
        const envVars = Object.entries(process.env)
            .filter(([key]) => key.startsWith('APP_'))
            .reduce((acc, [key, value]) => {
                const path = key.replace('APP_', '').toLowerCase().split('__')
                this.setDeepValue(acc, path, value)
                return acc
            }, {})

        return configs.concat(envVars).reduce(this.deepMergeConfigs, {})
    }

    private static deepMergeConfigs(target: object, source: object): object {
        return mergeWith({}, target, source, (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                return srcValue ?? objValue // 数组直接替换
            }
            if (isPlainObject(objValue)) {
                return this.deepMergeConfigs(objValue, srcValue || {}) // 递归合并对象
            }
            return srcValue !== undefined ? srcValue : objValue // 值覆盖
        })
    }

    private static setDeepValue(obj: object, path: string[], value: any): void {
        const lastKey = path.pop()
        let current = obj

        for (const key of path) {
            current[key] = current[key] || {}
            current = current[key]
        }

        if (lastKey) current[lastKey] = value
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ConfigLoader.load(process.env.NODE_ENV ?? 'development')],
            isGlobal: true,
        }),
    ],
})
export class EnvConfigModule {}
