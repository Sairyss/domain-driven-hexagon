import { DomainEvent } from 'src/core/domain-events';

// DomainEvent is a plain object with properties
export class UserCreatedDomainEvent extends DomainEvent {
  constructor(props: UserCreatedDomainEvent) {
    super(props.aggregateId, props.dateOccurred);
    this.email = props.email;
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }

  readonly email: string;

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;
}
