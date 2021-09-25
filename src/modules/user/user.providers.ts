import { Logger, Provider } from '@nestjs/common';

/* Constructing custom providers
 */
export const createUserCliLoggerSymbol = Symbol('createUserCliLoggerSymbol');

export const createUserCliLoggerProvider: Provider = {
  provide: createUserCliLoggerSymbol,
  useFactory: (): Logger => {
    return new Logger('create-user-cli');
  },
};
