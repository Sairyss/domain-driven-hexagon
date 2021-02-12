import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  // To avoid confusion between internal exceptions and NestJS exceptions
  ConflictException as NestConflictException,
  NotFoundException as NestNotFoundException,
  ForbiddenException as NestForbiddenException,
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
          throw new NestForbiddenException(err.message);
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
