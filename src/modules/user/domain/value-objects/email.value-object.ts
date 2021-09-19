import {
  DomainPrimitive,
  ValueObject,
} from '@libs/ddd/domain/base-classes/value-object.base';
import {
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@libs/exceptions';
import { Guard } from '@libs/ddd/domain/guard';

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
    this.props.value = Email.format(value);
  }

  /* Type compatibility in TypeScript is based on structural subtyping.
  For example, when assigning this Value Object to a type of other Value
  Object that also has only "value" property and both of those are public
  (their structures are equal), this means that TypeScript will treat those two different value objects as a same type (will let you assign
  'Email' value object to a 'Country' value object, because both of them
  only have 1 public 'value' property, so their structure is the same). 
  Protected 'props' and a getter prevents that behavior and makes types
  with the same structure incompatible. 
  https://www.typescriptlang.org/docs/handbook/type-compatibility.html#private-and-protected-members-in-classes  */
  get value(): string {
    return this.props.value;
  }

  /**
   * Note: This is a very simplified example of validation,
   * real world projects will have stricter rules
   */
  protected validate({ value }: DomainPrimitive<string>): void {
    if (!Guard.lengthIsBetween(value, 5, 320)) {
      throw new ArgumentOutOfRangeException('Email');
    }
    if (!value.includes('@')) {
      throw new ArgumentInvalidException('Email has incorrect format');
    }
  }

  static format(email: string): string {
    return email.trim().toLowerCase();
  }
}
