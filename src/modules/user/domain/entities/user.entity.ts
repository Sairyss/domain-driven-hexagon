import { Entity, EntityProps } from 'src/core/base-classes/entity.base';
import { Address } from '../value-objects/address.value-object';
import { Email } from '../value-objects/email.value-object';

export interface UserProps extends EntityProps {
  email: Email;
  address: Address;
}

export interface UpdateUserAddressProps {
  country?: string;
  postalCode?: string;
  street?: string;
}

export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps) {
    super(props);
    UserEntity.validate(props); // validating at construction
    this.email = props.email;
    this._address = props.address;
  }

  private _address: Address;

  /* Private properties and getters without a setter protects entity
  from outside modifications by using assignment, for example:
  "user.email = someOtherEmail". This technique only allows
  updating value by using a setter method (see updateAddress below) */
  get address(): Address {
    return this._address;
  }

  /* email is 'readonly', this means it can't be updated
  even by using a setter. Use 'readonly' properties if you know that
  a property never should be updated */
  readonly email: Email;

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */
  updateAddress(props: UpdateUserAddressProps): void {
    this._address = new Address({ ...this._address, ...props });
  }

  someBusinessLogic(): void {
    // TODO: add example business logic
  }

  static validate(props: UserProps): void {
    // TODO: example
    // entity business rules validation to protect it's invariant
  }
}
