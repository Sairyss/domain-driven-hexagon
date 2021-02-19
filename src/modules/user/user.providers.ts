import { Provider } from '@nestjs/common';
import { UserRepository } from './database/user.repository';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { DeleteUserService } from './use-cases/remove-user/delete-user.service';

/* Constructing providers to avoid having framework decorators
   in application core. */

export const createUserSymbol = Symbol('createUser');

export const createUserProvider: Provider = {
  provide: createUserSymbol,
  useFactory: (userRepo: UserRepository): CreateUserService => {
    return new CreateUserService(userRepo);
  },
  inject: [UserRepository],
};

export const removeUserSymbol = Symbol('removeUser');

export const removeUserProvider: Provider = {
  provide: removeUserSymbol,
  useFactory: (userRepo: UserRepository): DeleteUserService => {
    return new DeleteUserService(userRepo);
  },
  inject: [UserRepository],
};
