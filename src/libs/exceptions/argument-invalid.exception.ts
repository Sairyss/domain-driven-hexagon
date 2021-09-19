import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly name = Exceptions.argumentInvalid;
}
