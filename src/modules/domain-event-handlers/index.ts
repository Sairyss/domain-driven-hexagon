import { DomainEventHandler } from 'src/core/domain-events';
import { OnUserCreatedDomainEvent } from './user-created.event-handler';

const domainEventHandlers: DomainEventHandler[] = [
  new OnUserCreatedDomainEvent(),
];

export function initDomainEventHandlers(): void {
  domainEventHandlers.forEach((eventHandler: DomainEventHandler) =>
    eventHandler.listen(),
  );
}
