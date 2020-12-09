import { ExceptionBase, ExceptionDetails } from './exception.base';
import { Exceptions } from './exception.types';

export class ArgumentOutOfRangeException extends ExceptionBase {
  constructor(
    readonly argument: string,
    readonly details: ExceptionDetails[] = [],
  ) {
    super(`${argument} is out of range`, details);
  }

  readonly name = Exceptions.argumentOutOfRangeException;
}
