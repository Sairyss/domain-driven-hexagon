import { ArgumentInvalidException } from '../exceptions';
import { ValueObject } from '../base-classes/value-object.base';

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);
    super(date);
  }

  public get value(): Date {
    return this.props;
  }

  protected validate(date: Date): void {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new ArgumentInvalidException('Incorrect date');
    }
  }
}
