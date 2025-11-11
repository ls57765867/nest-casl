import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
    code: number
    message: string
    data: T
    timestamp: string
}

// 增强版拦截器
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                // 支持自定义响应格式
                if (data && typeof data === 'object' && ('customCode' in data || 'customMessage' in data)) {
                    const { customCode, customMessage, ...restData } = data
                    return {
                        code: customCode || 200,
                        message: customMessage || 'Success',
                        data: restData,
                        timestamp: new Date().toISOString(),
                    }
                }

                return {
                    code: 200,
                    message: 'Success',
                    data,
                    timestamp: new Date().toISOString(),
                }
            }),
        )
    }
}
