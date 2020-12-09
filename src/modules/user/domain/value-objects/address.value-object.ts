import { ValueObject } from 'src/core/base-classes/value-object.base';
import { Guard } from 'src/core/guard';
import {
  ArgumentOutOfRangeException,
  ExceptionDetails,
  ValidationException,
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
      throw new ValidationException('Address object is empty');
    }
    // collecting range validation details before throwing
    const outOfRangeDetails: ExceptionDetails[] = [];
    if (!Guard.lengthIsBetween(props.country, 2, 50)) {
      outOfRangeDetails.push({ key: 'country', value: props.country });
    }
    if (!Guard.lengthIsBetween(props.street, 2, 50)) {
      outOfRangeDetails.push({ key: 'street', value: props.street });
    }
    if (!Guard.lengthIsBetween(props.postalCode, 2, 10)) {
      outOfRangeDetails.push({ key: 'postalCode', value: props.postalCode });
    }
    if (outOfRangeDetails.length) {
      throw new ArgumentOutOfRangeException('address', outOfRangeDetails);
    }
  }
}
