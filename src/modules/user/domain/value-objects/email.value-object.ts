import { ValueObject } from 'src/core/base-classes/value-object.base';
import { ArgumentOutOfRangeException, ValidationException } from '@exceptions';
import { Guard } from 'src/core/guard';

export class Email extends ValueObject {
  constructor(value: string) {
    super(value);
    const email = Email.format(value);
    // validating in a constructor ensures that only valid objects are created. This protects object's invariant and prevents it to be in invalid state.
    Email.validate(email);
    this._value = email;
  }

  // Value Objects are immutable so properties are always readonly
  private readonly _value: string;

  /* Type compatibility in TypeScript is based on structural subtyping.
  For example, when assigning this Value Object to a type of other Value
  Object that also has only "value" property and both of those are public
  (their structures are equal), this means that TypeScript will treat those two different value objects as a same type (will let you assign
  'Email' value object to a 'Country' value object, because both of them
  only have 1 public 'value' property, so their structure is the same). 
  Private '_value' and a getter prevents that behavior and makes types
  with the same structure incompatible. 
  https://www.typescriptlang.org/docs/handbook/type-compatibility.html#private-and-protected-members-in-classes  */
  get value(): string {
    return this._value;
  }

  static validate(email: string): void {
    if (!Guard.lengthIsBetween(email, 5, 320)) {
      throw new ArgumentOutOfRangeException('Email');
    }
    if (!email.includes('@')) {
      throw new ValidationException('Email has incorrect format');
    }
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }
}
