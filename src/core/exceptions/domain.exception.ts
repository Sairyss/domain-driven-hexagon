import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

/**
 * Indicates violation of some domain rule.
 *
 * @class DomainException
 * @extends {ExceptionBase}
 */
export class DomainException extends ExceptionBase {
  readonly name = Exceptions.domainException;
}
