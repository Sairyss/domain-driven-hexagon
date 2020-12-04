import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

export class ValidationException extends ExceptionBase {
  readonly name = Exceptions.validationException;
}
