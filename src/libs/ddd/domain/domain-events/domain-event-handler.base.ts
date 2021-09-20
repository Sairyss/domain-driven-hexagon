import { DomainEvent, DomainEventClass, DomainEvents } from '.';

export abstract class DomainEventHandler {
  constructor(private readonly event: DomainEventClass) {}

  abstract handle(event: DomainEvent): Promise<void>;

  public listen(): void {
    DomainEvents.subscribe(this.event, this);
  }
}
