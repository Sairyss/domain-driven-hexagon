import { v4 as uuidV4, validate } from 'uuid';
import { ArgumentInvalidException } from '../exceptions';
import {
  DomainPrimitive,
  ValueObject,
} from '../base-classes/value-object.base';

export class ID extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  /**
   *Returns new ID instance with randomly generated ID value
   * @static
   * @return {*}  {ID}
   * @memberof ID
   */
  static generate(): ID {
    return new ID(uuidV4());
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!validate(value)) {
      throw new ArgumentInvalidException('Incorrect ID format');
    }
  }
}
