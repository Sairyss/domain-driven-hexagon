import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 * @extends {ExceptionBase}
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  readonly name = Exceptions.argumentNotProvided;
}
