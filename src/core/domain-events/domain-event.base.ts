import { DateVO } from '../value-objects/date.value-object';
import { ID } from '../value-objects/id.value-object';

export abstract class DomainEvent {
  public abstract readonly aggregateId: ID;

  public readonly dateOccurred = DateVO.now();
}
