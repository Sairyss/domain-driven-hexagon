import { ExceptionBase } from '@src/libs/exceptions';

export class UserAlreadyExistsError extends ExceptionBase {
  constructor(metadata?: unknown) {
    super('User already exists', metadata);
  }

  public readonly code = 'USER.ALREADY_EXISTS';
}
