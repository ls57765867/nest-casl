import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class UserContextService {
    constructor(private readonly cls: ClsService) {}

    setUser(username: string) {
        this.cls.set('username', username)
    }

    getUser(): string {
        return this.cls.get('username') || '未登录用户'
    }
}
