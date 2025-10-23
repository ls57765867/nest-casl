import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, Logger as nestLogger } from '@nestjs/common'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('/api/')
    const logger = new nestLogger()
    // const logger = app.get(Logger) 使用pino
    // app.useLogger(logger)
    await app.listen(process.env.PORT ?? 3000)
    logger.log(`Application listening on port ${process.env.PORT ?? 3000}`)
}
bootstrap()
