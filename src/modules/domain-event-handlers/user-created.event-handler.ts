import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { DomainEventHandler, DomainEvents } from 'src/core/domain-events';

export class OnUserCreatedDomainEvent implements DomainEventHandler {
  public listen(): void {
    DomainEvents.subscribe(
      UserCreatedDomainEvent,
      this.onUserCreated.bind(this),
    );
  }

  async onUserCreated(event: UserCreatedDomainEvent): Promise<void> {
    // Do changes to other aggregates or prepare Integration Event for dispatching.
  }
}
