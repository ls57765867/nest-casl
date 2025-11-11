import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, UseGuards, Request, HttpCode } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './dto'
import { LocalAuthGuard } from './local-auth.guard'
import { Public } from '../decorators/public.decorator'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // 排除密码
@Public()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    @UseGuards(LocalAuthGuard)
    signin(@Request() req: Request & { user: SigninDto }) {
        return this.authService.signin(req.user)
    }

    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }
}
