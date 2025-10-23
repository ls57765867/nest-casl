"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const path_1 = require("path");
const getLogFileName = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `log-${y}-${m}-${d}.txt`;
};
let AppLoggerModule = class AppLoggerModule {
};
exports.AppLoggerModule = AppLoggerModule;
exports.AppLoggerModule = AppLoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: 'info',
                    customLogLevel: (res, err) => {
                        if (err.statusCode >= 400) {
                            return 'error';
                        }
                        return 'silent';
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
                                        file: (0, path_1.join)('logs', getLogFileName()),
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
], AppLoggerModule);
//# sourceMappingURL=logger.module.js.map