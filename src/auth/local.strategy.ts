import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { signinDto } from './dto'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super()
    }

    async validate(username: string, password: string): Promise<any> {
        if (!username || !password) {
            throw new UnauthorizedException('用户名或密码不能为空')
        }
        const user = await this.authService.validateUser(username, password)
        if (!user) {
            throw new HttpException('用户名或密码错误!', 500)
        }
        return user
    }
}
