import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { UserRepositoryPort } from '@modules/user/database/user.repository.port';
import { Address } from '@modules/user/domain/value-objects/address.value-object';
import { Email } from '@modules/user/domain/value-objects/email.value-object';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler.base';
import {Inject} from "@nestjs/common";
import {UnitOfWorkPort} from "@libs/ddd/domain/ports/unit-of-work.port";
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserAlreadyExistsError } from '../../errors/user.errors';

@CommandHandler(CreateUserCommand)
export class CreateUserService extends CommandHandlerBase {
  constructor(@Inject("UnitOfWorkPort") protected readonly unitOfWork: UnitOfWorkPort) {
    super(unitOfWork);
  }

  async handle(
    command: CreateUserCommand,
  ): Promise<Result<ID, UserAlreadyExistsError>> {
    /* Use a repository provided by UnitOfWork to include everything 
       (including changes caused by Domain Events) into one 
       atomic database transaction */
    const userRepo: UserRepositoryPort = this.unitOfWork.getUserRepository(
      command.correlationId,
    );
    // user uniqueness guard
    if (await userRepo.exists(command.email)) {
      /** Returning an Error instead of throwing it
       *  so a controller can handle it explicitly */
      return Result.err(new UserAlreadyExistsError());
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
    return Result.ok(created.id);
  }
}
