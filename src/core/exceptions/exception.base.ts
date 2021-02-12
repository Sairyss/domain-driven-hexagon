import { ObjectLiteral } from '../types';
import { Exceptions } from './exception.types';

export interface SerializedException {
  name: string;
  message: string;
  stack?: string;
  metadata?: ObjectLiteral;
}

/**
 * Base class for custom exceptions.
 *
 * @abstract
 * @class ExceptionBase
 * @extends {Error}
 */
export abstract class ExceptionBase extends Error {
  /**
   * @param {string} message
   * @param {ObjectLiteral} [metadata={}]
   * **BE CAREFUL** not to include sensitive info in 'metadata' to prevent leaks since
   * all exception's data will end up in application's log files. Only include non-sensitive
   * info that may help with debugging.
   */
  constructor(readonly message: string, readonly metadata?: ObjectLiteral) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract name: Exceptions;

  toJSON(): SerializedException {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata,
    };
  }
}
