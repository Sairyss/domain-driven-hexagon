import { Exceptions } from './exception.types';

export interface ExceptionDetails {
  key?: string;
  value: string;
}

export interface SerializedExceptionInterface {
  error: {
    name: string;
    message: string;
    details: ExceptionDetails[];
  };
}

export abstract class ExceptionBase extends Error {
  constructor(
    readonly message: string,
    readonly details: ExceptionDetails[] = [],
  ) {
    super(message);
  }

  abstract name: Exceptions;

  toJSON(): SerializedExceptionInterface {
    return {
      error: {
        name: this.name,
        message: this.message,
        details: this.details,
      },
    };
  }
}
