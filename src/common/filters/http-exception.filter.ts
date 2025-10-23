// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common'
import { Request, Response } from 'express'
import dayjs from 'dayjs'

/**
 * 全局HTTP异常过滤器
 * @Catch() 装饰器不带参数表示捕获所有类型的异常
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor() {}
    /**
     * 异常处理方法
     * @param exception 捕获到的异常对象
     * @param host 提供访问请求和响应对象的工具
     */
    catch(exception: unknown, host: ArgumentsHost) {
        // 获取HTTP上下文
        const ctx = host.switchToHttp()
        // 获取响应对象
        const response = ctx.getResponse<Response>()
        // 获取请求对象
        const request = ctx.getRequest<Request>()

        // 初始化响应数据
        let status = HttpStatus.INTERNAL_SERVER_ERROR // 默认500错误
        let message = 'Internal server error' // 默认错误消息
        let error = 'Internal Server Error' // 默认错误类型
        let stack: string | undefined // 堆栈信息（开发环境）

        // 处理HTTP标准异常
        if (exception instanceof HttpException) {
            status = exception.getStatus() // 获取异常状态码
            const exceptionResponse = exception.getResponse() // 获取异常响应体

            // 处理不同类型的响应体
            if (typeof exceptionResponse === 'object') {
                // 对象类型响应体（通常来自 @nestjs/common 的异常）
                message = (exceptionResponse as any).message || message
                error = (exceptionResponse as any).error || error
            } else {
                // 字符串类型响应体
                message = exceptionResponse as string
            }
        }
        // 处理普通Error对象
        else if (exception instanceof Error) {
            error = exception.name // 错误名称（如 TypeError）
            message = exception.message // 错误消息
            // 开发环境返回堆栈信息
            stack = process.env.NODE_ENV === 'development' ? exception.stack : undefined
        }
        // this.logger.error(`Unhandled Exception: ${error}: ${message}`, stack && { stack }, 'HttpExceptionFilter')
        // 构造并发送错误响应
        response.status(status).json({
            statusCode: status, // HTTP状态码
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 时间戳
            path: request.url, // 请求路径
            error, // 错误类型
            message, // 错误消息
            ...(stack && { stack }), // 条件包含堆栈信息
        })
    }
}
