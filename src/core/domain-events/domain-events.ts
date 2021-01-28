import { AggregateRoot } from '../base-classes/aggregate-root.base';
import { Logger } from '../ports/logger.port';
import { DomainEvent } from '.';
import { final } from '../decorators/final.decorator';
import { ID } from '../value-objects/id.value-object';

export interface EventHandler {
  subscribeTo(event: DomainEvent): void;
}

export type EventCallback = (event: DomainEvent) => Promise<void>;

type EventName = string;

type DomainEventClass = new (...args: never[]) => DomainEvent;

@final
export class DomainEvents {
  private static subscribers: Map<EventName, EventCallback[]> = new Map();

  private static aggregates: AggregateRoot<unknown>[] = [];

  public static subscribe<T extends DomainEvent>(
    event: DomainEventClass,
    callback: (event: T) => Promise<void>,
  ): void {
    const eventName: EventName = event.name;
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    this.subscribers.get(eventName)?.push(callback as EventCallback);
  }

  public static prepareForPublish(aggregate: AggregateRoot<unknown>): void {
    const aggregateFound = !!this.findAggregateByID(aggregate.id);
    if (!aggregateFound) {
      this.aggregates.push(aggregate);
    }
  }

  public static async publishEvents(id: ID, logger: Logger): Promise<void> {
    const aggregate = this.findAggregateByID(id);

    if (aggregate) {
      await Promise.all(
        aggregate.domainEvents.map((event: DomainEvent) => {
          logger.debug(
            `[Domain Event published]: ${event.constructor.name} ${aggregate.id.value}`,
          );
          return this.publish(event);
        }),
      );
      aggregate.clearEvents();
      this.removeAggregateFromPublishList(aggregate);
    }
  }

  private static findAggregateByID(id: ID): AggregateRoot<unknown> | undefined {
    for (const aggregate of this.aggregates) {
      if (aggregate.id.equals(id)) {
        return aggregate;
      }
    }
  }

  private static removeAggregateFromPublishList(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const index = this.aggregates.findIndex(a => a.equals(aggregate));
    this.aggregates.splice(index, 1);
  }

  private static async publish(event: DomainEvent): Promise<void> {
    const eventName: string = event.constructor.name;

    if (this.subscribers.has(eventName)) {
      const callbacks: EventCallback[] = this.subscribers.get(eventName) || [];
      await Promise.all(callbacks.map(callback => callback(event)));
    }
  }
}
