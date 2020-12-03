import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

export class DomainValidationException extends ExceptionBase {
  readonly name = Exceptions.domainValidationException;
}
