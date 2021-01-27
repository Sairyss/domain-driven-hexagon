import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  // Not to confuse internal exceptions with Nest exceptions
  ConflictException as NestConflictException,
  NotFoundException as NestNotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ExceptionBase,
  ConflictException,
  NotFoundException,
  DomainException,
} from '@exceptions';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof DomainException) {
          throw new ForbiddenException(err.message);
        }
        if (err instanceof NotFoundException) {
          throw new NestNotFoundException(err.message);
        }
        if (err instanceof ConflictException) {
          throw new NestConflictException(err.message);
        }
        return throwError(err);
      }),
    );
  }
}
