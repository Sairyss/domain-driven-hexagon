import { Provider } from '@nestjs/common';
import { EventEmitterAdapter } from 'src/infrastructure/adapters/event-emitter.adapter';
import { eventEmitterSymbol } from 'src/infrastructure/providers/event-emitter.provider';
import { UserRepository } from './database/user.repository';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { DeleteUserService } from './use-cases/remove-user/delete-user.service';

/* Constructing providers to avoid having framework decorators
   in application core. */

export const createUserSymbol = Symbol('createUser');

export const createUserProvider: Provider = {
  provide: createUserSymbol,
  useFactory: (
    userRepo: UserRepository,
    eventEmitter: EventEmitterAdapter,
  ): CreateUserService => {
    return new CreateUserService(userRepo, eventEmitter);
  },
  inject: [UserRepository, eventEmitterSymbol],
};

export const removeUserSymbol = Symbol('createUser');

export const removeUserProvider: Provider = {
  provide: removeUserSymbol,
  useFactory: (
    userRepo: UserRepository,
    eventEmitter: EventEmitterAdapter,
  ): DeleteUserService => {
    return new DeleteUserService(userRepo, eventEmitter);
  },
  inject: [UserRepository, eventEmitterSymbol],
};
