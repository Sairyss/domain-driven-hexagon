import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

export class BusinessRuleValidationException extends ExceptionBase {
  readonly name = Exceptions.businessRuleValidationException;
}
