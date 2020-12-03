import { ExceptionBase, ExceptionDetails } from './exception.base';
import { Exceptions } from './exception.types';

export class NotFoundException extends ExceptionBase {
  constructor(
    readonly message: string = 'Not found',
    readonly details: ExceptionDetails[] = [],
  ) {
    super(message, details);
  }

  readonly name = Exceptions.notFoundException;
}
