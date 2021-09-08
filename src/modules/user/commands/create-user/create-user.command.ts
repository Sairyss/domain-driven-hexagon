import { AddressProps } from '../../domain/value-objects/address.value-object';

// Command is a plain object with properties
export class CreateUserCommand {
  constructor(props: CreateUserCommand) {
    this.email = props.email;
    this.address = props.address;
  }

  readonly email: string;

  readonly address: AddressProps;
}
