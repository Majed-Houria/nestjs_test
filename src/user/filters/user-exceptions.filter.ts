import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class UserExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as any;

    response.status(status).json({
      statusCode: status,
      message: errorResponse.message || exception.message,
      error: errorResponse.error || 'User Error',
      details: errorResponse.details || null,
    });
  }
}
