import { EventEmitterPort } from 'src/application/ports/event-emitter.port';
import { UserEvents } from 'src/application/events/events';
import { UserRepositoryPort } from '@modules/user/database/user.repository.interface';

export class DeleteUserService {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly event: EventEmitterPort,
  ) {}

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepo.delete(id);

    this.event.emit(UserEvents.deleted, deleted);
  }
}
