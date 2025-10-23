import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    constructor();
    catch(exception: unknown, host: ArgumentsHost): void;
}
