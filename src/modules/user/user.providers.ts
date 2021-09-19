import { Logger, Provider } from '@nestjs/common';
import { CreateUserUoW } from 'src/infrastructure/database/units-of-work';
import { UserRepository } from './database/user.repository';
import { CreateUserService } from './commands/create-user/create-user.service';
import { DeleteUserService } from './commands/delete-user/delete-user.service';

/* Constructing providers to avoid having framework decorators
   like @Injectable() or @Inject() inside application core.
   Though if you want to simplify things using those decorators
   is acceptable since they are not very intrusive.
   Choose how "pure" your application core / domain has to be 
   depending on your needs.
*/

export const createUserSymbol = Symbol('createUser');

export const createUserProvider: Provider = {
  provide: createUserSymbol,
  useFactory: (): CreateUserService => {
    // Initiating UnitOfWork and injecting a transactional repository
    CreateUserUoW.init();
    const userRepo = CreateUserUoW.getUserRepository();
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

export const createUserCliLoggerSymbol = Symbol('createUserCliLoggerSymbol');

export const createUserCliLoggerProvider: Provider = {
  provide: createUserCliLoggerSymbol,
  useFactory: (): Logger => {
    return new Logger('create-user-cli');
  },
};
