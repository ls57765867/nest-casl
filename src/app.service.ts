import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from './enum/config.enum'

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}
    getHello(): string {
        return this.configService.get(ConfigEnum.DB) ?? ''
    }
}
