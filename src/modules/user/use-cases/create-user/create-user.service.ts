import { ID } from 'src/core/value-objects/id.value-object';
import { EventEmitterPort } from 'src/core/ports/event-emitter.port';
import { UserEvents } from 'src/core/events/events';
import { UserRepositoryPort } from '@modules/user/database/user.repository.interface';
import { ConflictException } from '@exceptions';
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from '../../domain/entities/user.entity';

export class CreateUserService {
  constructor(
    // no direct dependency on a repository, instead depends on a port
    private readonly userRepo: UserRepositoryPort,
    private readonly event: EventEmitterPort,
  ) {}

  async createUser(command: CreateUserCommand): Promise<ID> {
    // user uniqueness guard
    if (await this.userRepo.exists(command.email.value)) {
      throw new ConflictException('User already exists');
    }

    const user = new UserEntity(command);

    user.someBusinessLogic();

    const created = await this.userRepo.save(user);

    // emitting user created event so an event handler somewhere may receive it and do an appropriate action, like sending confirmation email, adding user to mailing list, send notification to slack etc
    this.event.emit(UserEvents.created, created);

    return created.id as ID;
  }
}
