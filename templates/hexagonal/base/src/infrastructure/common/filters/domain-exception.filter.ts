import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../../../domain/common/domain.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  public catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // By default, domain logic violations are bad requests to the API.
    let status = HttpStatus.BAD_REQUEST;

    // We can explicitly map "NotFound" domain errors to 404s.
    if (exception.name.includes('NotFound')) {
      status = HttpStatus.NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // We expose the typed error name to the frontend so they can translate it easily.
      errorType: exception.name,
      message: exception.message,
    });
  }
}
