import { ExceptionBase } from './exception.base';
import { Exceptions } from './exception.types';

export class ArgumentOutOfRangeException extends ExceptionBase {
  constructor(readonly argument: string) {
    super(`${argument} is out of range`);
  }

  readonly name = Exceptions.argumentOutOfRangeException;
}
