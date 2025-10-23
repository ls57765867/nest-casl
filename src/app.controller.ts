import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from './enum/config.enum'

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    getHello(): string {
        console.log(this.configService.get('db'))
        console.log(this.configService.get(ConfigEnum.DB_HOST))
        console.log(this.configService.get(ConfigEnum.DB_URL))
        console.log(process.env.ENV)
        return this.appService.getHello()
    }
}
