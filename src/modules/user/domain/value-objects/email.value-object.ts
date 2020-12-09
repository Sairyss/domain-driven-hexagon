import { ValueObject } from 'src/core/base-classes/value-object.base';
import { ValidationException } from '@exceptions';

export class Email extends ValueObject {
  constructor(value: string) {
    super();
    const email = Email.format(value);
    // validating in a constructor ensures that only valid objects are created. This protects object's invariant and prevents it to be in invalid state.
    Email.validate(email);
    this._value = email;
  }

  private readonly _value: string;

  /* Type compatibility in TypeScript is based on structural subtyping. Private _value and a getter prevents that and makes types with the same structure incompatible. 
  https://www.typescriptlang.org/docs/handbook/type-compatibility.html#private-and-protected-members-in-classes  */
  get value(): string {
    return this._value;
  }

  static validate(email: string): void {
    if (!email.includes('@')) {
      throw new ValidationException('Email has incorrect format');
    }
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }
}
