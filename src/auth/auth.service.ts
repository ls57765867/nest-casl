import { HttpException, Injectable, UseGuards } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { SigninDto, SignupDto } from './dto'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { User } from '../user/user.entity'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findUserByUsername(username)
        if (!user) throw new HttpException('账号或密码错误', 500)
        let isMatch = false
        try {
            isMatch = await argon2.verify(user.password, pass)
            if (!isMatch) throw new HttpException('账号或密码错误', 500)
            const { password, ...result } = user
            return result
        } catch (error) {
            throw new HttpException('账号或密码错误', 500)
        }
    }

    // async signin(signinDto: SigninDto) {
    //     const user = await this.userService.findUser(signinDto.username, signinDto.password)
    //     if (!user) {
    //         throw new HttpException('用户不存在', 500)
    //     }
    //     const { password, ...result } = user
    //     return result
    // }

    async signin(user: any) {
        const payload = { username: user.username, userid: user.id }
        return {
            ...user,
            access_token: this.jwtService.sign(payload),
            customMessage: '登录成功',
        }
    }

    async signup(signupDto: SignupDto) {
        return await this.userService.addUser(signupDto)
    }
}
