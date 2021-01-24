import { Entity } from 'src/core/base-classes/entity.base';
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

export class UserEntity extends Entity<UserProps> {
  /* Private properties and getters without a setter protects entity
  from outside modifications by using assignment, for example:
  "user.email = someOtherEmail". This technique only allows
  updating value by using a setter method (see updateAddress below) */
  get address(): Address {
    return this.props.address;
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
