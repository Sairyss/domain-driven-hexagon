import { On } from 'nest-event';
import { UserEvents } from 'src/application/events/events';
import { UserEntity } from '../../domain/entities/user.entity';

export class UserDeletedEventHandler {
  @On(UserEvents.deleted)
  userRemovedHandler(user: UserEntity): void {
    // handle user deleted event here, like sending confirmation email etc
  }
}
