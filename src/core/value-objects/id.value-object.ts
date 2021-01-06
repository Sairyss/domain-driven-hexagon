import { ValidationException } from '@exceptions';
import { v4 as uuidv4, validate } from 'uuid';
import { ValueObject } from '../base-classes/value-object.base';

export class ID extends ValueObject {
  constructor(value?: string) {
    super();
    if (value) {
      ID.validate(value);
      this._value = value;
    } else {
      this._value = uuidv4();
    }
  }

  private readonly _value: string;

  get value(): string {
    return this._value;
  }

  static validate(value: string): void {
    if (!validate(value)) {
      throw new ValidationException('Incorrect ID format');
    }
  }
}
