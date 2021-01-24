import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

/**
 * Used to indicate that an argument is out of allowed range
 * (for example: incorrect string/array length, number not in allowed min/max range etc)
 *
 * @class ArgumentOutOfRangeException
 * @extends {ExceptionBase}
 */
export class ArgumentOutOfRangeException extends ExceptionBase {
  readonly name = Exceptions.argumentOutOfRange;
}
