import { ExceptionBase, ExceptionDetails } from './exception.base';
import { Exceptions } from './exception.types';

export class ArgumentOutOfRangeException extends ExceptionBase {
  constructor(
    readonly argument: string,
    readonly message: string = `${argument} is out of range`,
    readonly details: ExceptionDetails[] = [],
  ) {
    super(message, details);
  }

  readonly name = Exceptions.argumentOutOfRangeException;
}
