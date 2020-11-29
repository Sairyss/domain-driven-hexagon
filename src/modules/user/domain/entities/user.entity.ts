import { Entity, EntityProps } from 'src/domain/base-classes/entity.base';
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
    this._email = props.email;
    this._address = props.address;
  }

  private _email!: Email;

  private _address!: Address;

  // Private properties and getters without a setter protects entity invariant and prevents it from being in an invalid state. Use "update" method instead to restrict invalid operations
  get email(): Email {
    return this._email;
  }

  get address(): Address {
    return this._address;
  }

  // Update method only changes properties that we allow, in this case only address. This prevents from illegal actions, for example setting email from outside by doing something like user.email = otherEmail
  updateAddress(props: UpdateUserAddressProps): void {
    this._address = new Address({ ...this._address, ...props });
  }

  someBusinessLogic(): void {
    // TODO: add example business logic
  }
}
