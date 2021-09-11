import { ID } from 'src/core/value-objects/id.value-object';
import { UserRepositoryPort } from '@modules/user/database/user.repository.interface';
import { ConflictException } from '@exceptions';
import { Address } from '@modules/user/domain/value-objects/address.value-object';
import { Email } from '@modules/user/domain/value-objects/email.value-object';
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from '../../domain/entities/user.entity';

export class CreateUserService {
  constructor(
    // no direct dependency on a repository, instead depends on a port
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async createUser(command: CreateUserCommand): Promise<ID> {
    // user uniqueness guard
    if (await this.userRepo.exists(command.email)) {
      throw new ConflictException('User already exists');
    }

    const user = new UserEntity({
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
  }
}
