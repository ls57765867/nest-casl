import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'

const getLogFileName = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `log-${y}-${m}-${d}.txt`
}

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'info',
                customLogLevel: (res, err) => {
                    if (err.statusCode >= 400) {
                        return 'error'
                    }
                    return 'silent'
                },
                transport: {
                    targets: [
                        process.env.NODE_ENV === 'development'
                            ? {
                                  target: 'pino-pretty',
                                  options: {
                                      colorize: true,
                                      translateTime: 'SYS:standard',
                                      ignore: 'pid,hostname',
                                  },
                              }
                            : {
                                  target: 'pino-roll',
                                  options: {
                                      file: join('logs', getLogFileName()),
                                      frequency: 'daily',
                                      mkdir: true,
                                  },
                              },
                    ],
                },
                redact: ['req.headers.authorization'],
                customProps: (req) => ({ context: 'HTTP', requestId: req.id }),
                serializers: {
                    req: (req) => ({
                        id: req.id,
                        method: req.method,
                        url: req.url,
                    }),
                    res: (res) => ({
                        statusCode: res.statusCode,
                    }),
                    err: (err) => ({
                        message: err.message,
                        stack: err.stack,
                    }),
                },
            },
        }),
    ],
})
export class AppLoggerModule {}
