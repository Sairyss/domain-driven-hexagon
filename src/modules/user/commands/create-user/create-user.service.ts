import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { UserRepositoryPort } from '@modules/user/database/user.repository.port';
import { ConflictException } from '@libs/exceptions';
import { Address } from '@modules/user/domain/value-objects/address.value-object';
import { Email } from '@modules/user/domain/value-objects/email.value-object';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work';
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from '../../domain/entities/user.entity';

export class CreateUserService {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async create(
    command: CreateUserCommand,
    userRepo: UserRepositoryPort,
  ): Promise<ID> {
    // user uniqueness guard
    if (await userRepo.exists(command.email)) {
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

    const created = await userRepo.save(user);

    return created.id;
  }

  async execute(command: CreateUserCommand): Promise<ID> {
    const correlationId = this.unitOfWork.init();
    const userRepo: UserRepositoryPort = this.unitOfWork.getUserRepository(
      correlationId,
    );
    // Wrapping user creation in a UnitOfWork so events get included in a transaction
    return UnitOfWork.execute(correlationId, async () =>
      this.create(command, userRepo),
    );
  }
}
