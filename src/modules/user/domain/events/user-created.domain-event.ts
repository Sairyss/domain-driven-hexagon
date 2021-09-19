import { DomainEvent, DomainEventProps } from '@libs/ddd/domain/domain-events';

// DomainEvent is a plain object with properties
export class UserCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
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
