import { ValueObject } from 'src/core/base-classes/value-object.base';
import { Guard } from 'src/core/guard';
import {
  ArgumentOutOfRangeException,
  DomainValidationException,
} from '@exceptions';

export interface AddressProps {
  country: string;
  postalCode: string;
  street: string;
}

export class Address extends ValueObject {
  constructor(props: AddressProps) {
    super();
    Address.validate(props);
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;

  static validate(props: AddressProps): void {
    if (Guard.isEmpty(props)) {
      throw new DomainValidationException('Address object is empty');
    }
    if (Guard.lengthIsBetween(props.country, 2, 50)) {
      throw new ArgumentOutOfRangeException('country');
    }
    if (Guard.lengthIsBetween(props.street, 2, 50)) {
      throw new ArgumentOutOfRangeException('street');
    }
    if (Guard.lengthIsBetween(props.postalCode, 2, 10)) {
      throw new ArgumentOutOfRangeException('postalCode');
    }
  }
}
