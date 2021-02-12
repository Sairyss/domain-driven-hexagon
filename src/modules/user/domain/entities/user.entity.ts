import { AggregateRoot } from 'src/core/base-classes/aggregate-root.base';
import { UserCreatedDomainEvent } from '../events/user-created.domain-event';
import { Address, AddressProps } from '../value-objects/address.value-object';
import { Email } from '../value-objects/email.value-object';

export interface UserProps {
  email: Email;
  address: Address;
}

export interface UpdateUserAddressProps {
  country?: string;
  postalCode?: string;
  street?: string;
}

export class UserEntity extends AggregateRoot<UserProps> {
  constructor(props: UserProps) {
    super(props);
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action, like sending confirmation email, adding user
    to mailing list, send notification to slack etc */
    this.addEvent(
      new UserCreatedDomainEvent(this.id, this.props.email, this.address),
    );
  }

  /* Private properties and getters without a setter protects entity
  from outside modifications by using assignment, for example:
  "user.email = someOtherEmail". This technique only allows
  updating value by using a dedicated 'update' method (see updateAddress below) */
  get address(): Address {
    return this.props.address;
  }

  get email(): Email {
    return this.props.email;
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */
  updateAddress(props: UpdateUserAddressProps): void {
    this.props.address = new Address({
      ...this.props.address,
      ...props,
    } as AddressProps);
  }

  someBusinessLogic(): void {
    // TODO: add example business logic
  }

  static validate(props: UserProps): void {
    // TODO: example
    // entity business rules validation to protect it's invariant
  }
}
