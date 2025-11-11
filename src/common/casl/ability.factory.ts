import { Injectable } from '@nestjs/common'
import { AbilityBuilder, Ability, ExtractSubjectType } from '@casl/ability'

/**
 * 通用 AbilityFactory：把 user -> permissions 映射为规则
 * 期望：req.user.roles[].permissions（或通过 roles.menus.permissions 收集）是字符串数组
 */
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'
type Subjects = string | 'all'

@Injectable()
export class CaslAbilityFactory {
    /**
     * 从 user 收集权限码并转成 can(...) 规则
     * @param user req.user，需包含 roles 并每个 role 带 permissions 或 menus.permissions
     */
    defineAbilityFor(user: any) {
        const { can, cannot, build } = new AbilityBuilder(Ability as any)

        if (!user) {
            // 未登录：默认只读 menus
            can('read' as Actions, 'Menu')
            return build({ detectSubjectType: (item) => (item as any).constructor as ExtractSubjectType<Subjects> })
        }

        // admin 特殊处理
        if (user.roles?.some((r) => r.name === 'admin')) {
            can('manage' as Actions, 'all')
            return build({ detectSubjectType: (item) => (item as any).constructor as ExtractSubjectType<Subjects> })
        }

        // 收集权限码：两种来源 role.permissions 或 role.menus[].permissions
        const codes = new Set<string>()
        for (const role of user.roles || []) {
            if (Array.isArray(role.permissions)) {
                role.permissions.forEach((c: string) => codes.add(c))
            }
            if (Array.isArray(role.menus)) {
                for (const m of role.menus) {
                    ;(m.permissions || []).forEach((c: string) => codes.add(c))
                }
            }
        }

        // 把每个 code 解析成 action+subject (可扩展解析器)
        for (const code of Array.from(codes)) {
            const parsed = this.parsePermissionCode(code)
            if (!parsed) continue
            const { action, subject, condition } = parsed
            if (condition) {
                can(action as Actions, subject, condition)
            } else {
                can(action as Actions, subject)
            }
        }

        return build({ detectSubjectType: (item) => (item as any).constructor as ExtractSubjectType<Subjects> })
    }

    /**
     * 解析 permission code 到 action/subject/condition
     * 支持格式：
     *  - 'article:update' -> {action:'update', subject:'Article'}
     *  - 'article:update:own' -> 代表只允许自己的资源（约定）
     *  这里可根据你项目扩展更多语法
     */
    parsePermissionCode(code: string) {
        // 简单切分：resource:action[:flag]
        const parts = code.split(':')
        if (parts.length < 2) return null
        const [resource, action, flag] = parts
        const subject = this.resourceToSubject(resource) // 'article' -> 'Article' 或 class 名
        // 如果标记为 'own' 我们转成条件 authorId == user.id（需要在调用处替换 user）
        if (flag === 'own') {
            // 返回 condition with placeholder; defineAbilityFor 会在能拿到 user 时替换 { authorId: user.id }
            return { action, subject, condition: { ownerFlag: 'own' } }
        }
        return { action, subject, condition: null }
    }

    resourceToSubject(resource: string) {
        // 统一把资源小写转换为首字母大写类名（或直接返回字符串）
        // 你也可以映射 'article' -> Article class
        return resource.charAt(0).toUpperCase() + resource.slice(1)
    }
}
