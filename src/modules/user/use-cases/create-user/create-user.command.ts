import {
  Address,
  AddressProps,
} from '../../domain/value-objects/address.value-object';
import { Email } from '../../domain/value-objects/email.value-object';

export interface CreateUserProps {
  email: string;
  address: AddressProps;
}

export class CreateUserCommand {
  constructor(props: CreateUserProps) {
    this.email = new Email(props.email);
    this.address = new Address(props.address);
  }

  readonly email: Email;

  readonly address: Address;
}
