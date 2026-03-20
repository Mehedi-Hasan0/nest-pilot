import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../../../domain/common/domain.error';

/**
 * DomainExceptionFilter — catches all DomainError subclass instances and converts
 * them to appropriate HTTP responses.
 *
 * HTTP Status Code Mapping
 * ─────────────────────────────────────────────────────────────────────────────
 * Domain error class name convention → HTTP status
 *
 *  *NotFound*         → 404 Not Found
 *    Examples: UserNotFoundError, PostNotFoundError, CommentNotFoundError
 *
 *  *AlreadyInUse*     → 409 Conflict
 *    Examples: EmailAlreadyInUseError
 *
 *  *AlreadySet*       → 409 Conflict
 *    Examples: EmailAlreadySetError (changing email to the same value)
 *
 *  *Unauthorized*     → 401 Unauthorized  (reserved — use NestJS UnauthorizedException for JWT)
 *
 *  *Forbidden*        → 403 Forbidden     (reserved — use for ownership violations)
 *
 *  Everything else    → 400 Bad Request
 *    Examples: InvalidEmailError, InvalidNameError, InvalidPostStateTransitionError,
 *              CannotChangePublishedPostTitleError, InvalidCommentContentError
 *
 * Why name-based discrimination?
 * ─────────────────────────────────────────────────────────────────────────────
 * The filter catches the abstract DomainError base class. DomainError sets
 * this.name = this.constructor.name in its constructor, so every subclass
 * carries a stable, type-safe name string. Checking this.name avoids importing
 * every concrete error class into the infrastructure layer, which would create
 * upward dependencies (infrastructure → domain is fine; avoid coupling to
 * specific error classes when a naming convention is sufficient).
 *
 * Response Shape
 * ─────────────────────────────────────────────────────────────────────────────
 * {
 *   "statusCode": 409,
 *   "timestamp":  "2026-03-20T09:00:00.000Z",
 *   "path":       "/users",
 *   "errorType":  "EmailAlreadyInUseError",   ← stable key for frontend i18n
 *   "message":    "Email foo@bar.com is already in use by another user."
 * }
 *
 * Exposing `errorType` as a stable string lets frontend clients map domain
 * errors to localised messages without string-matching the human-readable
 * `message` field, which may change.
 */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  public catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveHttpStatus(exception);

    // Log unexpected 500-level domain errors so they show up in server monitoring.
    // 4xx errors are expected domain behaviour and should not pollute error logs.
    if (status >= 500) {
      this.logger.error(
        `Unhandled domain error: ${exception.name} — ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // Stable, machine-readable key — use this for frontend i18n translation
      errorType: exception.name,
      message: exception.message,
    });
  }

  /**
   * Derives the HTTP status code from the domain error's class name.
   * Using name-convention matching keeps the infrastructure layer decoupled
   * from individual domain error imports.
   */
  private resolveHttpStatus(exception: DomainError): HttpStatus {
    const name = exception.name;

    if (name.includes('NotFound')) {
      return HttpStatus.NOT_FOUND; // 404
    }

    if (name.includes('AlreadyInUse') || name.includes('AlreadySet')) {
      return HttpStatus.CONFLICT; // 409
    }

    if (name.includes('Unauthorized')) {
      return HttpStatus.UNAUTHORIZED; // 401
    }

    if (name.includes('Forbidden')) {
      return HttpStatus.FORBIDDEN; // 403
    }

    // Default: any other domain rule violation is a client error (bad request)
    return HttpStatus.BAD_REQUEST; // 400
  }
}
