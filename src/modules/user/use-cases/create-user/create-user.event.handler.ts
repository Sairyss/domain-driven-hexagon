import { On } from 'nest-event';
import { UserEvents } from 'src/core/events/events';
import { UserEntity } from '../../domain/entities/user.entity';

export class CreateUserEventHandler {
  @On(UserEvents.created)
  userCreatedHandler(user: UserEntity): void {
    // handle user created event here, like sending confirmation email etc
  }
}
