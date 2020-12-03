import { ArgumentOutOfRangeException } from '@exceptions';
import { ValueObject } from '../base-classes/value-object.base';
import { Guard } from '../guard';

export class ID extends ValueObject {
  constructor(value: string) {
    super();
    ID.validate(value);
    this._value = value;
  }

  private readonly _value: string;

  get value(): string {
    return this._value;
  }

  static validate(value: string): void {
    if (Guard.lengthIsBetween(value, 1, 36)) {
      throw new ArgumentOutOfRangeException('id');
    }
  }
}
