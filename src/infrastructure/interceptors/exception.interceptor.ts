import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  // Not to confuse internal exceptions with Nest exceptions
  ConflictException as NestConflictException,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConflictException } from '../exceptions/conflict.exception';
import { ExceptionBase } from '../exceptions/exception.base';
import { InputValidationException } from '../exceptions/input-validation.exception';
import { NotFoundException } from '../exceptions/not-found.exception';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof InputValidationException) {
          throw new BadRequestException(err, err.message);
        }
        if (err instanceof NotFoundException) {
          throw new NestNotFoundException(err, err.message);
        }
        if (err instanceof ConflictException) {
          throw new NestConflictException(err, err.message);
        }
        return throwError(err);
      }),
    );
  }
}
