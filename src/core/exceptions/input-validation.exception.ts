import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

export class InputValidationException extends ExceptionBase {
  readonly name = Exceptions.inputValidationException;
}
