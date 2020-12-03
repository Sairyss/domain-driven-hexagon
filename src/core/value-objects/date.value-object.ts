import { DomainValidationException } from '@exceptions';
import { ValueObject } from '../base-classes/value-object.base';

export class DateVO extends ValueObject {
  constructor(value: Date) {
    super();
    this.value = new Date(value);
  }

  readonly value: Date;

  static validate(date: Date): void {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new DomainValidationException('Incorrect date');
    }
  }
}
