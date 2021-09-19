import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { UserRepositoryPort } from '@modules/user/database/user.repository.port';
import { ConflictException } from '@libs/exceptions';
import { Address } from '@modules/user/domain/value-objects/address.value-object';
import { Email } from '@modules/user/domain/value-objects/email.value-object';
import { CreateUserUoW } from 'src/infrastructure/database/units-of-work';
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from '../../domain/entities/user.entity';

export class CreateUserService {
  constructor(
    // no direct dependency on a repository, instead depends on a port
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<ID> {
    // Wrapping everything in a UnitOfWork so events get included in a transaction
    return CreateUserUoW.execute(async () => {
      // user uniqueness guard
      if (await this.userRepo.exists(command.email)) {
        throw new ConflictException('User already exists');
      }

      const user = UserEntity.create({
        email: new Email(command.email),
        address: new Address({
          country: command.country,
          postalCode: command.postalCode,
          street: command.street,
        }),
      });

      user.someBusinessLogic();

      const created = await this.userRepo.save(user);

      return created.id;
    });
  }
}
