import { v4 as uuidV4, validate } from 'uuid';
import { ValidationException } from '../exceptions';
import { ValueObject } from '../base-classes/value-object.base';

export class ID extends ValueObject {
  constructor(value: string) {
    super(value);
    ID.validate(value);
    this._value = value;
  }

  private readonly _value: string;

  public get value(): string {
    return this._value;
  }

  /**
   *Returns new ID instance with randomly generated ID value
   */
  static generate(): ID {
    return new ID(uuidV4());
  }

  static validate(value: string): void {
    if (!validate(value)) {
      throw new ValidationException('Incorrect ID format');
    }
  }
}
