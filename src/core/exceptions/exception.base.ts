import { Exceptions } from './exception.types';

export interface SerializedExceptionInterface {
  error: {
    name: string;
    message: string;
  };
}

export abstract class ExceptionBase extends Error {
  constructor(readonly message: string) {
    super(message);
  }

  abstract name: Exceptions;

  toJSON(): SerializedExceptionInterface {
    return {
      error: {
        name: this.name,
        message: this.message,
      },
    };
  }
}
